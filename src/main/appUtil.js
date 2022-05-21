/* eslint-disable @typescript-eslint/no-unused-vars */
const { ipcMain, app } = require('electron');
const pathKinds = ['home', 'appData', 'userData', 'temp', 'downloads', 'logs'];

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
    }
    return Promise.resolve(result);
  });
};

module.exports = setupIPCHandlers;
