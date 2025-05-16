require("dotenv").config();
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      additionalArguments: [`--apiBaseUrl=${process.env.API_BASE_URL}`],
    },
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));

  mainWindow.maximize(); // inicia maximizado (não fullscreen)

  const menu = Menu.buildFromTemplate([
    {
      label: "Opções",
      submenu: [
        { role: "reload", label: "Recarregar (F5)" },
        { role: "toggleDevTools", label: "DevTools (F12)" },
        { type: "separator" },
        { role: "quit", label: "Sair" },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F5" && input.type === "keyDown") mainWindow.reload();
    if (input.key === "F12" && input.type === "keyDown")
      mainWindow.webContents.toggleDevTools();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // envia evento de maximização
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-maximized-status", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-maximized-status", false);
  });
}

// controle de janelas
ipcMain.on("window-control", (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  if (action === "minimize") win.minimize();
  else if (action === "maximize") {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  } else if (action === "close") win.close();
});

// handler de verificação de estado da janela
ipcMain.handle("window-is-maximized-query", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win ? win.isMaximized() : false;
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
