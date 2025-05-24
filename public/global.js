async function apiFetch(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    ...options,
  };

  try {
    let res = await fetch(url, defaultOptions);

    // 401 bo'lsa refresh qilamiz
    if (res.status === 403) {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        // Yangi token olingan, qayta urinib ko‘ramiz
        res = await fetch(url, defaultOptions);
        return res;
      } else {
        // Refresh ham ishlamadi
        window.location.href = '/login';
        return;
      }
    }

    return res;
  } catch (err) {
    console.error("API fetch xatoligi:", err);
    window.location.href = '/login';
  }
}
