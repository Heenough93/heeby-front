import {useLoading} from "../context/LoadingContext.tsx";

export const useFetchWithLoading = () => {
  const { setLoading } = useLoading();

  const fetchWithLoading = async (url: string, options?: RequestInit) => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return fetchWithLoading;
};
