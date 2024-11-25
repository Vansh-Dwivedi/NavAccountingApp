// This main.js is for electron configurations so dont delete this.

import { app, BrowserWindow, ipcMain } from "electron";
import { exec } from "child_process";
import isDev from "electron-is-dev";
import path from "path";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Consider security implications
      contextIsolation: false, // Consider enabling context isolation
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Optional: Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Re-create a window in the app when the dock icon is clicked (macOS)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Communication for Opening Native Apps
ipcMain.on("open-native-app", (event, appName) => {
  const platform = process.platform;

  const commands = {
    win32: {
      calculator: "calc.exe",
      notepad: "notepad.exe",
    },
    darwin: {
      calculator: "open -a Calculator",
      notepad: "open -a TextEdit",
    },
    linux: {
      calculator: "gnome-calculator",
      notepad: "gedit",
    },
  };

  const command = commands[platform]?.[appName];

  if (command) {
    console.log(`Executing command: ${command}`);
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening ${appName}:`, error);
        event.reply("native-app-error", { appName, error: error.message });
      } else {
        console.log(`${appName} opened successfully.`);
      }
    });
  } else {
    console.error(`Unsupported app: ${appName} for platform: ${platform}`);
    event.reply("native-app-error", { appName, error: "Unsupported app." });
  }
});
