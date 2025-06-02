async function apiFetch(url, options = {}, retryCount = 0) {
    const MAX_RETRIES = 1; // Limit retries to prevent infinite loops

    const defaultOptions = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        // Handle 403 by attempting token refresh
        if (response.status === 403 && retryCount < MAX_RETRIES) {
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (refreshResponse.ok) {
                // Retry the original request with incremented retry count
                return apiFetch(url, options, retryCount + 1);
            } else {
                console.error(`Token refresh failed for ${url}: ${refreshResponse.status}`);
                window.location.href = '/login';
                return null;
            }
        }

        // Throw error for non-OK responses (except 403, handled above)
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return response;

    } catch (error) {
        console.error(`API fetch error for ${url}:`, error.message);
        // Only redirect for auth-related errors; others could be handled differently
        if (error.message.includes('403') || error.message.includes('401')) {
            // window.location.href = '/login';
            return null;
        }
        throw error; // Let the caller handle non-auth errors
    }
}