declare global {
  interface Window {
    electron: {
      util: {
        tcpPing(ip: string, port: number): Promise<boolean>;
        getHostInfo(): object;
      };
      ipcRenderer: {
        myPing(): void;
        title: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(channel: string, func: (...args: any[]) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(channel: string, func: (...args: any[]) => void): void;
      };
    };
  }
}

export {};
