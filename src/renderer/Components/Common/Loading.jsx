import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useAppState from 'renderer/hooks/useAppState';

const Loading = () => {
  const { modalOpen, setModalOpenState } = useAppState();
  const handleClose = () => {
    setModalOpenState(false);
  };
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={modalOpen}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default React.memo(Loading);
