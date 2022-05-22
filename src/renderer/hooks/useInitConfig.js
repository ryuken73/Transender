import React from 'react';
import { useDispatch } from 'react-redux';
import { initialize } from 'renderer/Components/Header/configSlice';

export default function useInitConfig() {
  const dispatch = useDispatch();
  const syncConfigStateWithStore = React.useCallback((defaultConfig, configStore) => {
    dispatch(initialize(defaultConfig, configStore));
    },
    [dispatch]
  );
  return {
    syncConfigStateWithStore,
  }
};
