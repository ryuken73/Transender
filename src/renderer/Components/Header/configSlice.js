import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appConfig: {},
};

export const configSlice = createSlice({
  name: 'configSlice',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      const { payload } = action;
      const { config } = payload;
      state.appConfig = config;
    },
    setConfigValue: (state, action) => {
      const { payload } = action;
      const { key, value } = payload;
      state.appConfig[key] = value;
    },
  },
});

export const { setConfig, setConfigValue } = configSlice.actions;

// customConfigStore is persisten Store like electron-store
// it should have set, get method (same function with Map)
// and need to implement store() method to get all saved config as object.
export const initialize =
  (defaultConfig, customConfigStore) => (dispatch, getState) => {
    try {
      console.log(customConfigStore)
      const customConfig = customConfigStore.store;
      dispatch(
        setConfig({
          config: {
            ...defaultConfig,
            ...customConfig,
          },
        })
      );
    } catch (error) {
      throw Error(error);
    }
  };
export const updateConfig =
  (customConfigStore) => (key, value) => (dispatch, getState) => {
    try {
      customConfigStore.set(key, value);
      dispatch(setConfigValue({ key, value }));
    } catch (error) {
      throw Error(error);
    }
  };

export default configSlice.reducer;
