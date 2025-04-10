import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// Set default headers
instance.defaults.headers.common["Content-Type"] = "application/json";

// Request interceptor to add bearer token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Bearer token retrieved from local storage
    console.log(token);
    console.log(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Bearer token added to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized: Redirecting to login");
          localStorage.removeItem("token");
          break;
        case 403:
          console.error("Forbidden: Access denied");
          break;
        case 404:
          console.error("Not Found: Resource unavailable");
          break;
        case 500:
          console.error("Server Error: Something went wrong");
          break;
        default:
          console.error(`Unhandled error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("Network Error: Please check your connection");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
