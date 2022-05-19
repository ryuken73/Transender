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

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const jobListRef = React.useRef([]);
  jobListRef.current = jobList;
  const allChecked = React.useMemo(() => {
    return jobList.length === 0
      ? false
      : jobList.every((job) => job.checked === true);
  }, [jobList]);
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
    const checkedJobs = jobListRef.current.filter(
      (job) => job.checked === true
    );
    checkedJobs.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    });
  }, [dispatch]);
  const setAllManualStartState = React.useCallback(() => {
    dispatch(updateJobs({ key: 'manualStarted', value: true }));
  }, [dispatch]);

  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
    setAllManualStartState,
  };
}
