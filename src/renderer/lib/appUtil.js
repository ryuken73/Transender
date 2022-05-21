const { ipcRenderer } = require('electron');

const getVersion = async () => {
  return ipcRenderer.invoke('getVersion');
};
const getPath = async (path='home') => {
  return ipcRenderer.invoke('getPath', path);
};

module.exports = {
  getVersion,
  getPath,
};
