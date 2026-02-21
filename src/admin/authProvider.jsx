const API_URL = "https://localhost:7062";

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
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user info in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem(
        "user_info",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
          emailConfirmed: data.emailConfirmed,
        })
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(error.message || "Invalid credentials"));
    }
  },

  // Handle logout
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    return Promise.resolve();
  },

  // Check if user is authenticated
  checkAuth: () => {
    const token = localStorage.getItem("auth_token");
    return token ? Promise.resolve() : Promise.reject();
  },

  // Handle API errors (401, 403, etc.)
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Get current user identity
  getIdentity: () => {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      return Promise.reject();
    }
    try {
      const user = JSON.parse(userInfo);
      return Promise.resolve(user);
    } catch {
      return Promise.reject();
    }
  },

  // Get user permissions (for role-based access)
  getPermissions: () => {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      return Promise.reject();
    }
    try {
      const user = JSON.parse(userInfo);
      return Promise.resolve(user.role);
    } catch {
      return Promise.reject();
    }
  },
};

export default authProvider;