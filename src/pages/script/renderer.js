window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const erro = document.getElementById("erro");

  loginBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("nome").value.trim();
    const password = document.getElementById("senha").value;

    erro.style.display = "none";

    if (!fullName || !password) {
      erro.textContent = "Preencha todos os campos.";
      erro.style.display = "block";
      console.warn("⚠️ Campos vazios no formulário.");
      return;
    }

    try {
      const result = await window.api.loginAdmin({ fullName, password });

      if (result?.token) {
        sessionStorage.setItem("authToken", result.token);
        window.location.href = "pages/html/home.html";
      } else {
        console.warn("❌ Login inválido. Sem token.");
        erro.textContent = result?.message || "Falha no login.";
        erro.style.display = "block";
      }
    } catch (err) {
      console.error("❌ Erro durante o login:", err);
      erro.textContent =
        "Erro na requisição. Verifique sua conexão ou tente novamente.";
      erro.style.display = "block";
    }
  });
});
