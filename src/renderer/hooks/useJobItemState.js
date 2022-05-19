/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateJob,
  updateJobProgress,
} from 'renderer/Components/Pages/MainTab/jobSlice';
import bullConstants from 'renderer/config/bull-constants';
import { getActiveTask } from 'renderer/lib/jobUtil';

const { JOB_STATUS, Q_ITEM_STATUS } = bullConstants;

export default function useJobItemState(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const retryEnabled = job
    ? job.tasks.some((task) => task.status === Q_ITEM_STATUS.FAILED)
    : false;
  const currentActiveTaskType = getActiveTask(job);
  // console.log('##### job in useJobItemState changed!', job)
  const updateJobState = React.useCallback(
    (key, value) => {
      dispatch(updateJob({ jobId, key, value }));
    },
    [dispatch, jobId]
  );
  const updateJobCheckState = React.useCallback(
    (checked) => {
      updateJobState('checked', checked);
    },
    [updateJobState]
  );
  const updateJobStatusState = React.useCallback(
    (status) => {
      updateJobState('status', status);
    },
    [updateJobState]
  );
  const updateJobTask = React.useCallback(
    (tasks) => {
      // console.log('^^^ in updateJobTask:', job);
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
  const updateJobProgressState = React.useCallback((progressObj) => {
    dispatch(updateJobProgress({ jobId, progress: progressObj}));
  });
  const updateJobPidState = React.useCallback(
    (pid) => {
      updateJobState('pid', pid);
    },
    [updateJobState]
  );
  const retryFailedTask = React.useCallback(() => {
    const tasksCloned = job.tasks.map((task) => {
      if (task.status === Q_ITEM_STATUS.FAILED) {
        return {
          ...task,
          status: Q_ITEM_STATUS.STANDBY,
        };
      }
      return {
        ...task,
      };
    });
    updateJobState('tasks', tasksCloned);
    updateJobStatusState(JOB_STATUS.READY);
  }, [job, updateJobState, updateJobStatusState]);

  return {
    job,
    retryEnabled,
    currentActiveTaskType,
    updateJobState,
    updateJobCheckState,
    updateJobStatusState,
    updateJobTask,
    updateJobPidState,
    updateJobProgressState,
    retryFailedTask,
  };
}
