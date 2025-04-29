import { useState, useEffect, useCallback } from 'react';
import axios from '../services/axios';

/**
 * Custom hook for data fetching
 * @param {string} url - Endpoint URL
 * @param {Object} options - Request options
 * @returns {Object} - Data, loading state, error, and refetch function
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;