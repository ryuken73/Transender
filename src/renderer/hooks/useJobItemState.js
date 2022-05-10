import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';

export default function useJobItemState(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const updateJobState = React.useCallback((key, value) => {
    dispatch(updateJob({ jobId, key, value }));
    },
    [dispatch, jobId]
  );
  const updateJobCheckState = React.useCallback((checked) => {
      updateJobState('checked', checked);
    },
    [updateJobState]
  );
  const updateJobStatusState = React.useCallback((status) => {
      updateJobState('status', status);
    },
    [updateJobState]
  );

  return { job, updateJobState, updateJobCheckState, updateJobStatusState };
}
