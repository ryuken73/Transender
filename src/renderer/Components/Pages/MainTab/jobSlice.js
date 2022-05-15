/* eslint-disable import/named */
/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import { mediaInfo, mediainfoQueue, addMediainfoQueue } from 'renderer/lib/queueUtil';

const { JOB_STATUS, Q_WORKER_EVENTS } = bullConstants;
const { LOG_LEVEL } = constants;

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

export const startMediainfoQueue =
  () =>
  (dispatch, getState) => {
    try {
      mediainfoQueue.process(1, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          // console.log('qTask.body.args.fullName:', qItemBody.args.fullName);
          const ret = await mediaInfo.run(qItemBody.inputFile);
          const isMediaFile = mediaInfo.isMediaFile();
          // console.log('###', mediaInfo.getResult())
          if (isMediaFile) {
            dispatch(
              updateJob({
                jobId: qItemBody.jobId,
                key: 'status',
                value: JOB_STATUS.READY,
              })
            );
            dispatch(
              setAppLog({ message: `Aanlyze ${qItemBody.inputFile} done.` })
            );
            done(null, {
              isMediaFile,
              rawResult: mediaInfo.getResult(),
              video: mediaInfo.getStreams('Video'),
              audio: mediaInfo.getStreams('Audio'),
            });
          } else {
            dispatch(
              updateJob({
                jobId: qItemBody.jobId,
                key: 'status',
                value: JOB_STATUS.FAILED,
              })
            );
            dispatch(
              setAppLog({
                level: LOG_LEVEL.ERROR,
                message: `Aanlyze ${qItemBody.inputFile} Faild.[not-media-file]`,
              })
            )
            done('codec unknows. suspect not media file.')
          }
        } catch(err){
          console.log('errored:', err);
          done(err)
        }
      })
    } catch (err) {
      throw new Error(err);
      // console.log(err);
    }
    return mediainfoQueue;
  }

export default jobSlice.reducer;
