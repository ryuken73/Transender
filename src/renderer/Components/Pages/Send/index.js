import React from 'react';
import { Outlet } from 'react-router-dom';

const Send = props => {
  return (
    <div>
      <div>send</div>
      <Outlet></Outlet>
    </div>
  )
}

export default React.memo(Send);
