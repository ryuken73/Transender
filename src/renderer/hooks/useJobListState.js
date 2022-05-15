/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateJobs,
  startMediainfoQueue,
} from 'renderer/Components/Pages/MainTab/jobSlice';

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  React.useEffect(() => {
    console.log('%%%%% called useJobListState');
    let queue;
    try {
      dispatch(startMediainfoQueue());
    } catch (err) {
      console.error(err);
    }
    return () => {
      console.log('remove event listener', queue);
      if (queue) {
        // remove EventListener of mediaInfo
      }
    };
  }, [dispatch]);
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

  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
  };
}
