const API_URL = "https://localhost:7062";

// Token storage keys
const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";

// Refresh lock to prevent multiple simultaneous refresh requests
let refreshPromise = null;

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

export const tokenManager = {
  // Store tokens
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Store user info
  setUserInfo: (userInfo) => {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  // Get user info
  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  },

  // Clear all tokens
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    refreshPromise = null;
  },

  // Refresh access token
  refreshAccessToken: async () => {
    // If already refreshing, return the same promise
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          const message = await parseErrorMessage(response, "Failed to refresh token");
          throw new Error(message);
        }

        const data = await response.json();

        // Store new tokens
        tokenManager.setTokens(data.accessToken, data.refreshToken);
        tokenManager.setUserInfo({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
          emailConfirmed: data.emailConfirmed,
        });

        return data.accessToken;
      } catch (error) {
        // Clear tokens on refresh failure
        tokenManager.clearTokens();
        throw error;
      } finally {
        // Clear the promise lock
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  // Revoke refresh token (logout)
  revokeToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      const accessToken = tokenManager.getAccessToken();

      if (refreshToken && accessToken) {
        await fetch(`${API_URL}/auth/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.warn("Failed to revoke token:", error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Check if token needs refresh (decode JWT and check expiration)
  shouldRefreshToken: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return false;

    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      // Refresh if token expires in less than 5 minutes
      return exp - now < 5 * 60 * 1000;
    } catch {
      return false;
    }
  },

  // Start automatic token refresh
  startAutoRefresh: () => {
    // Check every minute if token needs refresh
    const intervalId = setInterval(async () => {
      if (tokenManager.shouldRefreshToken()) {
        try {
          await tokenManager.refreshAccessToken();
          console.log("Token auto-refreshed");
        } catch (error) {
          console.error("Auto-refresh failed:", error);
          clearInterval(intervalId);
        }
      }
    }, 60 * 1000); // Check every minute

    return intervalId;
  },
};
