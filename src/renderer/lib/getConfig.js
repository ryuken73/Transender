/* eslint-disable no-restricted-globals */
// const {remote} = require('electron');
const Store = require('electron-store');
const path = require('path');
const electronUtil = require('./electronUtil');


const { ipcRenderer } = require('electron');

export const getAppInfo = async () => {
  return ipcRenderer.invoke('getAppInfo')
};

// const valuesToInt = (obj) => {
//   return Object.entries(obj).reduce((acc, element) => {
//     const [key, value] = element;
//     if (typeof value === 'string' && key === 'DELETE_SCHEDULE_CRON') {
//       return { ...acc, [key]: value };
//     }
//     const convertInt = isNaN(parseInt(value, 10)) ? value : parseInt(value, 10);
//     return { ...acc, [key]: convertInt };
//   }, {});
// };

// export const getCombinedConfig = (params = {}) => {
//   const { app } = electronUtil.isRenderer
//     ? require('electron').remote
//     : require('electron');
//   const defaultJsonFile = electronUtil.getAbsolutePath(
//     'config/default/config.json',
//     true
//   );
//   const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
//   const customJsonFile = path.join(app.getPath('home'), 'config.json');
//   const customJson =
//     customJsonFile === false ? {} : electronUtil.readJSONFile(customJsonFile);

//   const combinedConfig = { ...defaultJson, ...customJson };
//   const typeConverted = valuesToInt(combinedConfig);
//   return typeConverted;
// };

// export const getDefaultConfig = () => {
//   const defaultJsonFile = electronUtil.getAbsolutePath(
//     'config/default/config.json',
//     true
//   );
//   const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
//   return { ...defaultJson };
// };
