const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel:string, ...args:any[]) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (channel:string, callback:Function) => {
    ipcRenderer.on(channel, (event,data) => {
      callback(data);
    });
  },
  getQrcode: () => {
    ipcRenderer.send('getQrcode');
  },
  min: () => {
    ipcRenderer.send('window-minimize');
  }
});
