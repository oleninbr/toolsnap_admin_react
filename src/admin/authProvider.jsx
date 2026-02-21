import { tokenManager } from "../utils/tokenManager";

const API_URL = "https://localhost:7062";

// Auto-refresh interval
let autoRefreshInterval = null;

const parseErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    try {
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

const authProvider = {
  // Handle login
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, "Login failed");
        throw new Error(message);
      }

      const data = await response.json();

      // Store tokens before profile validation
      tokenManager.setTokens(data.accessToken, data.refreshToken);

      // Validate user role via profile endpoint
      const profileResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        tokenManager.clearTokens();
        throw new Error("Access denied");
      }

      const profile = await profileResponse.json();
      const role = (profile.role || "").toLowerCase();

      // Only allow admin users
      if (role !== "admin") {
        tokenManager.clearTokens();
        throw new Error("Admin access required");
      }

      // Store user info
      tokenManager.setUserInfo({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        emailConfirmed: data.emailConfirmed,
      });

      // Start automatic token refresh
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
      autoRefreshInterval = tokenManager.startAutoRefresh();

      return Promise.resolve();
    } catch (error) {
      tokenManager.clearTokens();
      return Promise.reject(new Error(error.message || "Invalid credentials"));
    }
  },

  // Handle logout
  logout: async () => {
    try {
      // Stop auto-refresh
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
      }

      // Revoke refresh token on server
      await tokenManager.revokeToken();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Logout error:", error);
      tokenManager.clearTokens();
      return Promise.resolve();
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      return Promise.reject();
    }

    try {
      // Try to refresh token if it's expiring soon
      if (tokenManager.shouldRefreshToken()) {
        await tokenManager.refreshAccessToken();
      }

      // Validate with profile endpoint
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        // Try to refresh token on 401
        if (response.status === 401) {
          await tokenManager.refreshAccessToken();
          
          // Retry with new token
          const retryResponse = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenManager.getAccessToken()}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error("Unauthorized");
          }

          const retryProfile = await retryResponse.json();
          const retryRole = (retryProfile.role || "").toLowerCase();

          if (retryRole !== "admin") {
            throw new Error("Admin access required");
          }

          return Promise.resolve();
        }

        throw new Error("Unauthorized");
      }

      const profile = await response.json();
      const role = (profile.role || "").toLowerCase();

      if (role !== "admin") {
        throw new Error("Admin access required");
      }

      return Promise.resolve();
    } catch {
      tokenManager.clearTokens();
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
      }
      return Promise.reject();
    }
  },

  // Handle API errors (401, 403, etc.)
  checkError: async (error) => {
    const status = error.status;
    
    if (status === 401) {
      // Try to refresh token
      try {
        await tokenManager.refreshAccessToken();
        // Token refreshed successfully, retry the request
        return Promise.resolve();
      } catch {
        // Refresh failed, logout
        tokenManager.clearTokens();
        if (autoRefreshInterval) {
          clearInterval(autoRefreshInterval);
          autoRefreshInterval = null;
        }
        return Promise.reject();
      }
    }
    
    if (status === 403) {
      tokenManager.clearTokens();
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
      }
      return Promise.reject();
    }
    
    return Promise.resolve();
  },

  // Get current user identity
  getIdentity: () => {
    const user = tokenManager.getUserInfo();
    if (!user) {
      return Promise.reject();
    }
    return Promise.resolve(user);
  },

  // Get user permissions (for role-based access)
  getPermissions: () => {
    const user = tokenManager.getUserInfo();
    if (!user) {
      return Promise.reject();
    }
    return Promise.resolve(user.role);
  },
};

export default authProvider;