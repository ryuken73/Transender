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
import { startMediainfoQueue, addQueue } from 'renderer/lib/mediaInfoQueue';
import bullConstants from 'renderer/config/bull-constants';

const { JOB_STATUS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  React.useEffect(() => {
    startMediainfoQueue(dispatch);
  }, [dispatch])

  const addJobsState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
        jobs.forEach((job) => {
          // dispatch(addJob({ job }));
          addQueue(job);
          dispatch(
            updateJob({
              jobId: job.jobId,
              key: 'status',
              value: JOB_STATUS.WAITING,
            })
          )
        });
      } else {
        throw new Error('jobs should be Array')
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
