window.addEventListener("DOMContentLoaded", () => {
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const closeBtn = document.getElementById("close-btn");

  minimizeBtn?.addEventListener("click", () => {
    window.api.controlWindow("minimize");
  });

  maximizeBtn?.addEventListener("click", () => {
    window.api.controlWindow("maximize");
  });

  closeBtn?.addEventListener("click", () => {
    window.api.controlWindow("close");
  });

  // ícone dinâmico
  window.api.onMaximizeChange((isMaximized) => {
    if (maximizeBtn) maximizeBtn.textContent = isMaximized ? "🗗" : "🗖";
  });

  window.api.isWindowMaximized().then((isMaximized) => {
    if (maximizeBtn) maximizeBtn.textContent = isMaximized ? "🗗" : "🗖";
  });
});
