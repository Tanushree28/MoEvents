import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../lib/axiosConfig";

const useApi = (url, method = "get", options = {}) => {
  const { initialData = null, cancelToken: cancelTokenProp = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch function
  const fetchData = useCallback(
    async (body = null, cancelToken = cancelTokenProp) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api[method](url, body, { cancelToken });
        setData(response.data);
        return response.data; // Return data to use in the caller
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err);
          console.error("API Error:", err); // Log for debugging
        }
      } finally {
        setLoading(false);
      }
    },
    [url, method, cancelTokenProp]
  );

  // Handle auto-fetching only when explicitly requested
  useEffect(() => {
    const source = axios.CancelToken.source();
    // If you want an auto-fetch (similar to the old "immediate"), you can still trigger it here.
    if (options.immediate !== false) {
      fetchData(null, source.token); // Trigger fetchData immediately
    }
    return () => {
      source.cancel("Component unmounted");
    };
  }, [fetchData, options.immediate]);

  return { data, loading, error, fetchData };
};

export default useApi;
