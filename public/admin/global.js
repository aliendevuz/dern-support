const AUTH_ENDPOINTS = {
  READ: '/admin/api/auth/refresh-read',
  PIN: '/admin/api/auth/refresh-write',
  PASSWORD: '/admin/api/auth/refresh-super',
};

const AUTH_TYPES = {
  READ: 'read'
};

async function apiFetch(url, options = {}, authType = AUTH_TYPES.READ, getCredentials = null) {
  const defaultOptions = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  try {
    let response = await fetch(url, defaultOptions);

    if (response.status !== 403) {
      return response;
    }

    // Handle 403 by attempting to refresh authentication
    let refreshPayload = {};
    let refreshEndpoint = AUTH_ENDPOINTS.READ;

    const refreshResponse = await fetch(refreshEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refreshPayload),
    });

    if (!refreshResponse.ok) {
      console.error(`API refresh error (${authType}):`, refreshResponse.statusText);
      // window.location.href = '/admin/';
      return null;
    }

    // Retry original request after successful refresh
    response = await fetch(url, defaultOptions);
    return response;

  } catch (error) {
    console.error(`API fetch error (${authType}):`, error.message);
    // window.location.href = '/admin/';
    return null;
  }
}

// Example usage with a custom credential input (replace with modal/form in practice)
async function exampleUsage() {
  const getCredentials = async (type) => {
    // Replace with a modal or form in your UI
    return prompt(`Please enter your ${type === AUTH_TYPES.PIN ? 'Pin Code' : 'Password'}:`);
  };

  try {
    const response = await apiFetch('/admin/api/some-endpoint', {}, AUTH_TYPES.READ, getCredentials);
    if (response && response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    }
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}