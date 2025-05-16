const { contextBridge, ipcRenderer } = require("electron");

const API_BASE_URL =
  process.argv.find((arg) => arg.startsWith("--apiBaseUrl="))?.split("=")[1] ||
  "http://localhost:4000";

contextBridge.exposeInMainWorld("api", {
  loginAdmin: async (dados) => {
    const response = await fetch(`${API_BASE_URL}/users/login-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return response.json();
  },
  listClients: async (page = 1, limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/api/listClient?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return response.json();
  },

  getCliente: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/clientes/${id}`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return response.json();
  },

  controlWindow: (action) => ipcRenderer.send("window-control", action),
  isWindowMaximized: () => ipcRenderer.invoke("window-is-maximized-query"),
  onMaximizeChange: (callback) =>
    ipcRenderer.on("window-maximized-status", (_e, state) => callback(state)),
});
