/* eslint-disable no-empty */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { ipcMain, app, dialog } = require('electron');

const pathKinds = ['home', 'appData', 'userData', 'temp', 'downloads', 'logs'];

async function selectDir() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'select directory',
    defaultPath: app.getPath('temp'),
    properties: ['openDirectory'],
  });
  if (canceled) {
  } else {
    return filePaths[0];
  }
}

const setupIPCHandlers = () => {
  ipcMain.handle('getVersion', () => {
    return Promise.resolve(app.getVersion());
  });
  ipcMain.handle('getAppInfo', (event) => {
    const paths = pathKinds.reduce((acct, path) => {
      return {
        ...acct,
        [path]: app.getPath(path),
      };
    }, {});
    const result = {
      paths,
      appName: app.name,
    };
    return Promise.resolve(result);
  });
  ipcMain.handle('changeDirectory', selectDir);
};

module.exports = setupIPCHandlers;
