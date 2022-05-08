const { ipcMain, app } = require('electron');

const setupIPCHandlers = () => {
  ipcMain.handle('getVersion', () => {
    return Promise.resolve(app.getVersion());
  });
}

module.exports = setupIPCHandlers;
