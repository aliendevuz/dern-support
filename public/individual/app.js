const pData = document.getElementById("data");

const getData = () => {
  apiFetch("api/individual/about", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      pData.innerText = JSON.stringify(data);
    })
};

function logout() {
  fetch("api/auth/logout", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        console.log(data);
      }
    });
}
