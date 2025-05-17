const { contextBridge, ipcRenderer } = require("electron");

const API_BASE_URL =
  process.argv.find((arg) => arg.startsWith("--apiBaseUrl="))?.split("=")[1] ||
  "http://localhost:4000";

contextBridge.exposeInMainWorld("api", {
  loginUsuario: async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          sucesso: false,
          mensagem: errorData?.error || 'Erro ao fazer login'
        };
      }

      const data = await response.json();
      return {
        sucesso: true,
        token: data.token,
        usuario: data.usuario
      };

    } catch (error) {
      console.error('Erro na requisição de login:', error);
      return {
        sucesso: false,
        mensagem: 'Erro de rede ou servidor indisponível'
      };
    }
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
