/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';

export default function useJobItemState(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  console.log('##### job in useJobItemState changed!', job)
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
  const updateJobTask = React.useCallback(tasks => {
    console.log('^^^ in updateJobTask:', job);
      const tasksCloned = [...job.tasks];
      tasks.forEach((task) => {
        const targetTaskIndex = tasksCloned.findIndex(
          (element) => element.taskId === task.taskId
        );
        tasksCloned[targetTaskIndex] = task;
      });
      updateJobState('tasks', tasksCloned);
    },
    [updateJobState, job]
  );

  return {
    job,
    updateJobState,
    updateJobCheckState,
    updateJobStatusState,
    updateJobTask,
  };
}
