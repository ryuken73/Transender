import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from 'renderer/config/constants';
const initialState = {
  jobList: [],
  tastList: [],
};

export const jobSlice = createSlice({
  name: 'jobSlice',
  initialState,
  reducers: {
    addJob: (state, action) => {
      const { payload } = action;
      const { job } = payload;
      state.jobList.push(job);
    },
  },
})

export const { addJob } = jobSlice.actions;

export default jobSlice.reducer;
