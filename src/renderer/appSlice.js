import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from 'renderer/config/constants';
const initialState = {
  modalOpen: false,
  isMessageBoxHidden: true,
  messageBoxText: 'test',
  messageBoxLevel: 'success',
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
      const [ key, value ] = payload;
      console.log('$$$$',key, value);
      state[key] = value;
    },
  },
})

export const { setModalOpen, setStateValue } = appSlice.actions;

export const showMessageBoxForDuration =
  (text, duration = 1000, level = 'success') =>
  async (dispatch, getState) => {
    dispatch(setStateValue(['isMessageBoxHidden', false]));
    dispatch(setStateValue(['messageBoxLevel', level]));
    dispatch(setStateValue(['messageBoxText', text]));
    setTimeout(() => {
      dispatch(setStateValue(['isMessageBoxHidden', true]));
    }, [duration])
    setTimeout(() => {
      const state = getState();
      if(state.app.isMessageBoxHidden) {
        dispatch(setStateValue(['messageBoxText', '']));
        dispatch(setStateValue(['messageBoxLevel', 'success']));
      }
    }, [duration + 500]);
}

export default appSlice.reducer;
