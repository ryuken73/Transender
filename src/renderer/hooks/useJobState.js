import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addJob } from 'renderer/Components/Pages/MainTab/jobSlice';

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
  return { jobList, addJobState };
}
