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

const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  React.useEffect(() => {
    const queue = startMediainfoQueue(dispatch);
  }, [dispatch])

  const addJobsState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
        return jobs.map((job) => {
          // dispatch(addJob({ job }));
          const task = addMediainfoQueue(job);
          task.on(Q_WORKER_EVENTS.COMPLETED, result => console.log('##### task done!:', result))
          task.on(Q_WORKER_EVENTS.FAILED, error => console.log('##### task failed!:', error))
          dispatch(
            updateJob({
              jobId: job.jobId,
              key: 'status',
              value: Q_ITEM_STATUS.WAITING,
            })
          );
          return task;
        });
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
