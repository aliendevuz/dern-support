async function apiFetch(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    ...options,
  };

  try {
    let res = await fetch(url, defaultOptions);

    if (res.status === 403) {
      const refreshRes = await fetch('/admin/api/auth/refresh-read', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        res = await fetch(url, defaultOptions);
        return res;
      } else {
        window.location.href = '/admin/login/';
        return;
      }
    }

    return res;
  } catch (err) {
    console.error("API fetch xatoligi:", err);
    window.location.href = '/admin/login';
  }
}


async function apiFetchWithAdminPinCode(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    ...options,
  };

  let res = await fetch(url, defaultOptions);

  if (res.status === 403) {
    // Parolni so‘raymiz
    const pinCode = prompt("Your session expired. Please re-enter your Pin Code:");

    if (!password) return;

    const refreshRes = await fetch('/admin/api/auth/refresh-write', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pinCode })
    });

    if (refreshRes.ok) {
      res = await fetch(url, defaultOptions);
      return res;
    } else {
      apiFetchWithAdminPassword(url, options);
    }
  }

  return res;
}


async function apiFetchWithAdminPassword(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    ...options,
  };

  let res = await fetch(url, defaultOptions);

  if (res.status === 403) {

    const password = prompt("Your session expired. Please re-enter your password:");

    if (!password) return;

    const refreshRes = await fetch('/admin/api/auth/refresh-super', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (refreshRes.ok) {
      res = await fetch(url, defaultOptions);
      return res;
    } else {
      apiFetchWithAdminPassword(url, options);
    }
  }

  return res;
}
