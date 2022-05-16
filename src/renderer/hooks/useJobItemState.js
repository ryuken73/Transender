/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';
import { addMediainfoQueue } from 'renderer/lib/queueUtil';
import { getTask, getNextTask } from 'renderer/lib/jobUtil';
import bullConstants from 'renderer/config/bull-constants';

const { TASK_TYPES, JOB_STATUS, Q_EVENTS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

const replaceElement = (array, element, index) => {
  const newArray = [...array];
  newArray[index] = element;
  return newArray;
};

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
  const updateJobTask = React.useCallback(tasks => {
    const tasksCloned = [...job.tasks];
      tasks.forEach((task) => {
        const targetTaskIndex = job.tasks.findIndex(
          (element) => element.taskId === task.taskId
        );
        tasksCloned[targetTaskIndex] = task;
      });
      updateJobState('tasks', tasksCloned);
    },
    [updateJobState, job]
  );
  const makeFFmpegOptions = (video, audio) => {
    return '-y -acodec copy -progress pipe:1';
  };
  const makeFFmpegOutPath = () => {
    return 'd:/temp/aaa.mp4';
  };
  const addMediainfoItem = React.useCallback(
    (task) => {
      const worker = addMediainfoQueue(task, job);
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { rawResult, video, audio } = result;
        const currentTask = getTask(job, task);
        const completedTask = {
          ...currentTask,
          status: Q_ITEM_STATUS.COMPLETED
        }
        // updateJobTask(statusChanged);
        console.log('&&&&', video('Count'));
        const ffmpegOptions = makeFFmpegOptions(video, audio);
        const totalFrames = video('Count')[0];
        const outFile = makeFFmpegOutPath();
        const nextTask = getNextTask(job, task);
        const updatedTask = {
          ...nextTask,
          ffmpegOptions,
          totalFrames,
          outFile,
        };
        console.log(updatedTask)
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error)
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [job, updateJobStatusState, updateJobTask]
  );
  return {
    job,
    updateJobState,
    updateJobCheckState,
    updateJobStatusState,
    updateJobTask,
    addMediainfoItem,
  };
}
