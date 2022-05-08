import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModalOpen } from 'renderer/appSlice';

export default function useAppState() {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.app.modalOpen);
  const setModalOpenState = React.useCallback(
    (open) => {
      dispatch(setModalOpen({ open }));
    },
    [dispatch]
  );
  return { modalOpen, setModalOpenState };
}
