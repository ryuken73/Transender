import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateConfig } from 'renderer/Components/Header/configSlice';

export default function useConfig(configStore) {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config.appConfig);
  const updateStoreNConfig = React.useMemo(() => updateConfig(configStore), [configStore])
  const updateConfigState = React.useCallback(({key, value}) => {
    dispatch(updateStoreNConfig(key, value));
  }, [ dispatch, updateStoreNConfig ]);
  return {
    config,
    updateConfigState,
  }
};
