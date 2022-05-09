import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addJob,
  updateJobStatus,
} from 'renderer/Components/Pages/MainTab/jobSlice';

export default function useAppState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const addJobState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        jobs.forEach((job) => dispatch(addJob({ job })));
      } else {
        throw new Error('jobs should be Array')
      }
    },
    [dispatch]
  );
  const updateJobStatusState = React.useCallback(
    (jobId, status) => {
      dispatch(updateJobStatus({ jobId, status }))
    },
    [dispatch]
  )
  return { jobList, addJobState, updateJobStatusState };
}
