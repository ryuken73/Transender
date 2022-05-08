import { contextBridge, ipcRenderer } from 'electron';
const tcpp = require('tcp-ping');
const os = require('os');

contextBridge.exposeInMainWorld('electron', {
  util: {
    async tcpPing(ip: string, port: number) {
      return new Promise((resolve, reject) => {
        tcpp.probe(ip, port, (err, available: boolean) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(available);
        });
      });
    },
    getHostInfo() {
      return {
        hostname: os.hostname(),
        ipAddresses: os.networkInterfaces()
      };
    },
  },
  ipcRenderer: {
    appName: 'template',
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(channel: string, func: (...args: any[]) => void) {
      const validChannels = ['ipc-example', 'progress'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(channel: string, func: (...args: any[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
