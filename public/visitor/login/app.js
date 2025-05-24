document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Forma reload qilmasligi uchun

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.error) {
        alert(data.error); // xato bo‘lsa ko‘rsatish
      } else {
        console.log("Login response:", data);
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
    });
});
