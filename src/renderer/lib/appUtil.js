const { ipcRenderer } = require('electron');

const getVersion = async () => {
  return ipcRenderer.invoke('getVersion');
};

module.exports = {
  getVersion,
};
