import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showMessageBoxForDuration } from 'renderer/appSlice';

function useMessageBox() {
  const dispatch = useDispatch();
  const showMessageBox = useCallback(
    (text, duration = 1000, level = 'success') => {
      dispatch(showMessageBoxForDuration(text, duration, level))
    },
    [dispatch]
  );
  return { showMessageBox };
}

export default useMessageBox;
