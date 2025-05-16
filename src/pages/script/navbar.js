window.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    fetch("../../components/navbar.html")
      .then((res) => res.text())
      .then((html) => {
        navbarContainer.innerHTML = html;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../css/navbar.css";
        document.head.appendChild(link);

        // logout
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn?.addEventListener("click", () => {
          sessionStorage.removeItem("authToken");
          window.location.href = "../../index.html";
        });

        // controles de janela
        const minimizeBtn = document.getElementById("minimize-btn");
        const maximizeBtn = document.getElementById("maximize-btn");
        const closeBtn = document.getElementById("close-btn");

        minimizeBtn?.addEventListener("click", () => {
          window.api.controlWindow("minimize");
        });

        maximizeBtn?.addEventListener("click", async () => {
          window.api.controlWindow("maximize");
        });

        closeBtn?.addEventListener("click", () => {
          window.api.controlWindow("close");
        });

        // atualizar ícone dinamicamente
        window.api.onMaximizeChange((isMaximized) => {
          if (maximizeBtn) maximizeBtn.textContent = isMaximized ? "🗗" : "🗖";
        });

        // verificar estado atual e setar ícone no carregamento
        window.api.isWindowMaximized().then((isMaximized) => {
          if (maximizeBtn) maximizeBtn.textContent = isMaximized ? "🗗" : "🗖";
        });
      });
  }
});
