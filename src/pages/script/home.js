window.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../index.html";
  }
});
