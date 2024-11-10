const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.whenReady().then(createWindow);

ipcMain.on('open-native-app', (event, appName) => {
  const platform = process.platform;
  
  const commands = {
    win32: {
      calculator: 'calc.exe',
      notepad: 'notepad.exe'
    },
    darwin: {
      calculator: 'open -a Calculator',
      notepad: 'open -a TextEdit'
    },
    linux: {
      calculator: 'gnome-calculator',
      notepad: 'gedit'
    }
  };

  const command = commands[platform]?.[appName];
  
  if (command) {
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening ${appName}:`, error);
        event.reply('native-app-error', { appName, error: error.message });
      }
    });
  }
}); 