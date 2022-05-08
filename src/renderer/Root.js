import React from 'react';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import App from './App';

const Root = () => {
  return (
    <HashRouter>
      <App/>
    </HashRouter>
  )
}

export default Root;
