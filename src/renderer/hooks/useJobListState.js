/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateJobs,
} from 'renderer/Components/Pages/MainTab/jobSlice';
import {
  startMediainfoQueue,
  addQueue as addMediainfoQueue,
} from 'renderer/lib/mediaInfoQueue';
import bullConstants from 'renderer/config/bull-constants';

const { JOB_STATUS, Q_EVENTS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  React.useEffect(() => {
    console.log('%%%%% called useJobListState');
    let queue;
    try {
      queue = startMediainfoQueue(dispatch);
      queue.on(Q_EVENTS.WAITING, (qItem) => console.log('%%%% waiting:', qItem));
      queue.on(Q_EVENTS.ACTIVE, (qItem) => console.log('%%%% started:', qItem));
      queue.on(Q_EVENTS.COMPLETED, (qItem, result) => console.log('%%%% completed: call dispatch', qItem, result));
      queue.on(Q_EVENTS.FAILED, (qItem, error) => console.log('%%%% failed:', qItem, error));
    } catch (err) {
      console.error(err);
    }
    return () => {
      console.log('remove event listener', queue);
      if (queue) {
        // remove EventListener of mediaInfo
      }
    }
  }, [dispatch])

  const addJobsState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
      } else {
        throw new Error('jobs should be Array');
      }
    },
    [dispatch]
  );
  const toggleAllCheckedState = React.useCallback((checked) => {
      dispatch(updateJobs({ key: 'checked', value: checked }));
    },
    [dispatch]
  );
  const removeJobAllCheckedState = React.useCallback(() => {
    const checkedJobs = jobList.filter((job) => job.checked === true);
    checkedJobs.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    })
  }, [dispatch, jobList]);
  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
  };
}
