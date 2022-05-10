/* eslint-disable prettier/prettier */
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
    addJobs: (state, action) => {
      const { payload } = action;
      const { jobs } = payload;
      state.jobList = [...state.jobList, ...jobs];
    },
    removeJob: (state, action) => {
      const { payload } = action;
      const { jobId } = payload;
      state.jobList = state.jobList.filter(job => job.jobId !== jobId);
    },
    updateJob: (state, action) => {
      const { payload } = action;
      const { jobId, key, value } = payload;
      const job = state.jobList.find(job => job.jobId === jobId);
      if(job) job[key] = value;
    },
    updateJobs: (state, action) => {
      const { payload } = action;
      const { key, value } = payload;
      state.jobList.forEach(job => job[key] = value);
    }
  },
})

export const { addJob, addJobs, removeJob, updateJob, updateJobs } = jobSlice.actions;

export default jobSlice.reducer;
