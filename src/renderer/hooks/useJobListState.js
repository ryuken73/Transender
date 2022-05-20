/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import bullConstants from 'renderer/config/bull-constants';
import constants from 'renderer/config/constants';
import useAppState from 'renderer/hooks/useAppState';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateAllJobs,
  updateCheckedJobs,
  // startMediainfoQueue,
} from 'renderer/Components/Pages/MainTab/jobSlice';

const { LOG_LEVEL } = constants;
const { JOB_STATUS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const { setAppLogState } = useAppState();
  const jobList = useSelector((state) => state.job.jobList);
  const jobListRef = React.useRef([]);
  jobListRef.current = jobList;
  const allChecked = React.useMemo(() => {
    return jobList.length === 0
      ? false
      : jobList.every((job) => job.checked === true);
  }, [jobList]);
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
      dispatch(updateAllJobs({ key: 'checked', value: checked }));
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
  const safeRemoveJobAllCheckedState = React.useCallback(() => {
    let exception = 0;
    const checkedJobsSafe = jobListRef.current.filter((job) => {
      const isChecked = job.checked === true;
      const isSafe =
        job.status !== JOB_STATUS.ACTIVE && job.status !== JOB_STATUS.WAITING;
      const canDelete = isChecked && isSafe;
      console.log('%%%%', isChecked, isSafe, job);
      if (!canDelete) {
        exception += 1;
      }
      return canDelete;
    });
    console.log('%%%%', checkedJobsSafe);
    checkedJobsSafe.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    });
    if (exception !== 0){
      setAppLogState(
        `active or waiting job can't be removed.[${exception}]`,
        LOG_LEVEL.ERROR
      );
    }
  }, [dispatch, setAppLogState]);
  const setCheckedManualStartState = React.useCallback(() => {
    dispatch(updateCheckedJobs({ key: 'manualStarted', value: true }));
  }, [dispatch]);

  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
    safeRemoveJobAllCheckedState,
    setCheckedManualStartState,
  };
}
