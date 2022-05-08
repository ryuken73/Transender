import React from 'react';
import ReactDOM from 'react-dom';
import 'renderer/index.css';
import Root from 'renderer/Root';
import {store} from 'renderer/store';
import {Provider} from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  // console.log(arg);
// });
// window.electron.ipcRenderer.myPing();
