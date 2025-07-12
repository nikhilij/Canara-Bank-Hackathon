import { useState, useEffect } from 'react';

// Custom hook for API calls
// TODO: Implement useApi hook
const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                    ...options,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url, JSON.stringify(options)]);

    const refetch = () => {
        if (url) {
            setError(null);
            setData(null);
            setLoading(true);
            fetchData();
        }
    };

    return { data, loading, error, refetch };
};

export default useApi;