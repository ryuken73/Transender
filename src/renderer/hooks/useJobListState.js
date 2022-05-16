/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateJobs,
  // startMediainfoQueue,
} from 'renderer/Components/Pages/MainTab/jobSlice';
import bullConstants from 'renderer/config/bull-constants';
import { setAppLog } from 'renderer/appSlice';
import {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
} from 'renderer/lib/queueUtil';

const { TASK_TYPES, JOB_STATUS, Q_EVENTS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  const addJobsState = React.useCallback((jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
      } else {
        throw new Error('jobs should be Array');
      }
    },
    [dispatch]
  );
  const toggleAllCheckedState = React.useCallback(
    (checked) => {
      dispatch(updateJobs({ key: 'checked', value: checked }));
    },
    [dispatch]
  );
  const removeJobAllCheckedState = React.useCallback(() => {
    const checkedJobs = jobList.filter((job) => job.checked === true);
    checkedJobs.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    });
  }, [dispatch, jobList]);
  const startMediainfoQueue = React.useCallback(() => {
    try {
      mediainfoQueue.process(3, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const ret = await mediaInfo.run(qItemBody.inputFile);
          const isMediaFile = mediaInfo.isMediaFile();
          console.log('###', mediaInfo.getResult())
          if (isMediaFile) {
            dispatch( setAppLog({ message: `Aanlyze ${qItemBody.inputFile} done.` }));
            done(null, {
              isMediaFile,
              rawResult: mediaInfo.getResult(),
              video: mediaInfo.getStreams('Video'),
              audio: mediaInfo.getStreams('Audio'),
            });
          } else {
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
  });

  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
    startMediainfoQueue
  };
}
