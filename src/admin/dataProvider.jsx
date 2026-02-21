import { tokenManager } from "../utils/tokenManager";

const API_URL = "https://localhost:7062";

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = tokenManager.getAccessToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Helper function to make authenticated request with retry on 401
const fetchWithRetry = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
    },
  });

  // If 401, try to refresh token and retry once
  if (response.status === 401) {
    console.log("🔄 Token expired, refreshing...");
    
    try {
      await tokenManager.refreshAccessToken();
      
      // Retry request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...getAuthHeaders(),
        },
      });
      
      console.log("✅ Request retried with new token");
    } catch (refreshError) {
      console.error("❌ Token refresh failed:", refreshError);
      throw response;
    }
  }

  return response;
};

const dataProvider = {
  getList: async (resource, params) => {
    const url = new URL(`${API_URL}/${resource}`);
    
    // Add pagination params if needed
    if (params.pagination) {
      url.searchParams.append("_start", (params.pagination.page - 1) * params.pagination.perPage);
      url.searchParams.append("_end", params.pagination.page * params.pagination.perPage);
    }
    
    // Add filters
    if (params.filter) {
      Object.keys(params.filter).forEach(key => {
        url.searchParams.append(key, params.filter[key]);
      });
    }
    
    // Add sorting
    if (params.sort) {
      url.searchParams.append("_sort", params.sort.field);
      url.searchParams.append("_order", params.sort.order);
    }

    try {
      console.log("🔵 Fetching:", url.toString());
      
      const response = await fetchWithRetry(url.toString(), {
        method: "GET",
        credentials: "omit",
      });

      console.log("📊 Response status:", response.status);
      console.log("📝 Response headers:", {
        contentRange: response.headers.get("Content-Range"),
        contentType: response.headers.get("Content-Type"),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("❌ API Error:", error);
        throw new Error(`API returned ${response.status}: ${error}`);
      }

      const data = await response.json();
      console.log("✅ Data received:", data);
      
      // If Content-Range header exists, use it; otherwise use data length
      const contentRange = response.headers.get("Content-Range");
      let total;
      
      if (contentRange) {
        // Parse "items 0-9/50" format
        const match = contentRange.match(/\/(\d+)/);
        total = match ? parseInt(match[1], 10) : data.length;
      } else {
        total = data.length;
      }

      return {
        data,
        total,
      };
    } catch (error) {
      console.error("🔴 Fetch error:", error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}/${params.id}`;
      console.log("🔵 Fetching:", url);
      
      const response = await fetchWithRetry(url, {
        method: "GET",
        credentials: "omit",
      });

      if (!response.ok) throw new Error("Failed to fetch one");

      const data = await response.json();
      console.log("✅ Data received:", data);
      return { data };
    } catch (error) {
      console.error("🔴 Fetch error:", error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    try {
      const url = new URL(`${API_URL}/${resource}`);
      
      // Add filter for IDs
      if (params.ids && params.ids.length > 0) {
        // Create filter for multiple IDs
        params.ids.forEach((id, index) => {
          url.searchParams.append(`id${index}`, id);
        });
      }

      console.log("🔵 Fetching many:", url.toString());
      
      const response = await fetchWithRetry(url.toString(), {
        method: "GET",
        credentials: "omit",
      });

      if (!response.ok) throw new Error("Failed to fetch many");

      const data = await response.json();
      console.log("✅ Data received:", data);
      
      // Filter data to only include requested IDs
      const filteredData = Array.isArray(data)
        ? data.filter(item => params.ids.includes(item.id))
        : [data];

      return { data: filteredData };
    } catch (error) {
      console.error("🔴 Fetch many error:", error);
      throw error;
    }
  },

  create: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}`;
      console.log("🔵 Creating:", url, params.data);
      
      const response = await fetchWithRetry(url, {
        method: "POST",
        credentials: "omit",
        body: JSON.stringify(params.data),
      });

      if (!response.ok) throw new Error("Failed to create");

      const data = await response.json();
      console.log("✅ Created:", data);
      return { data };
    } catch (error) {
      console.error("🔴 Creation error:", error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}/${params.id}`;
      console.log("🔵 Updating:", url, params.data);
      
      const response = await fetchWithRetry(url, {
        method: "PUT",
        credentials: "omit",
        body: JSON.stringify(params.data),
      });

      if (!response.ok) throw new Error("Failed to update");

      const data = await response.json();
      console.log("✅ Updated:", data);
      return { data };
    } catch (error) {
      console.error("🔴 Update error:", error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}/${params.id}`;
      console.log("🔵 Deleting:", url);
      
      const response = await fetchWithRetry(url, {
        method: "DELETE",
        credentials: "omit",
      });

      if (!response.ok) throw new Error("Failed to delete");

      console.log("✅ Deleted");
      return { data: {} };
    } catch (error) {
      console.error("🔴 Delete error:", error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    try {
      const responses = await Promise.all(
        params.ids.map(id => {
          const url = `${API_URL}/${resource}/${id}`;
          console.log("🔵 Deleting:", url);
          return fetchWithRetry(url, {
            method: "DELETE",
            credentials: "omit",
          });
        })
      );

      if (responses.some(r => !r.ok)) throw new Error("Failed to delete");

      console.log("✅ All deleted");
      return { data: params.ids };
    } catch (error) {
      console.error("🔴 Delete many error:", error);
      throw error;
    }
  },
};

export default dataProvider;
