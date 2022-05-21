import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from 'renderer/config/constants';
import { date } from 'renderer/utils';
import { initElectronLog } from 'renderer/lib/electronUtil';

// initialize application log (log file name, format etc..)
initElectronLog()
const { LOG_LEVEL } = CONSTANTS;
const initialState = {
  modalOpen: false,
  isMessageBoxHidden: true,
  messageBoxText: 'test',
  messageBoxLevel: 'success',
  appLog: {
    level: LOG_LEVEL.INFO,
    date: date.getLogDate(),
    message: 'App Started',
  },
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      const { payload } = action;
      const { open } = payload;
      state.modalOpen = open;
    },
    setStateValue: (state, action) => {
      const { payload } = action;
      const { key, value } = payload;
      state[key] = value;
    },
    setAppLog: (state, action) => {
      const { payload } = action;
      const { level = LOG_LEVEL.INFO, message } = payload;
      state.appLog = {
        level,
        date: date.getLogDate(),
        message,
      };
    },
  },
});

export const { setModalOpen, setStateValue, setAppLog } = appSlice.actions;

export const showMessageBoxForDuration =
  (text, duration = 1000, level = 'success') =>
  async (dispatch, getState) => {
    dispatch(setStateValue({ key: 'isMessageBoxHidden', value: false }));
    dispatch(setStateValue({ key: 'messageBoxLevel', value: level }));
    dispatch(setStateValue({ key: 'messageBoxText', value: text }));
    setTimeout(() => {
      dispatch(setStateValue({ key: 'isMessageBoxHidden', value: true }));
    }, [duration])
    setTimeout(() => {
      const state = getState();
      if(state.app.isMessageBoxHidden) {
        dispatch(setStateValue({ key: 'messageBoxText', value: '' }));
        dispatch(setStateValue({ key: 'messageBoxLevel', value: 'success' }));
      }
    }, [duration + 500]);
}

export default appSlice.reducer;
