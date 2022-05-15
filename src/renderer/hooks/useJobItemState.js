/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';
import { getMediainfoQueue } from 'renderer/lib/mediaInfoQueue';
import { getFFmepgQueue } from 'renderer/lib/ffmpegQueue';
import { getVirusScanQueue } from 'renderer/lib/virusScanQueue';
import { getSendFileQueue } from 'renderer/lib/sendFileQueue';
import bullConstants from 'renderer/config/bull-constants';

const { TASK_TYPES, Q_W } = bullConstants;

// const getQueueWorkers = (tasks) => {
//   const mediainfoQueue = getMediainfoQueue();
//   const ffmpegQueue = getFFmepgQueue();
//   const virusScanQueue = getVirusScanQueue();
//   const sendFileQueue = getSendFileQueue();
//   const { getQItem: getQItemMediainfo } = mediainfoQueue;
//   const { getQItem: getQItemFFmpeg } = ffmpegQueue;
//   const { getQItem: getQItemVirusScan } = virusScanQueue;
//   const { getQItem: getQItemSendFile } = sendFileQueue;
//   const mediainfoTask = tasks.find(
//     (task) => task.taskType === TASK_TYPES.MEDIAINFO
//   );
//   const ffmpegTask = tasks.find(
//     (task) => task.taskType === TASK_TYPES.TRANSCODE
//   );
//   const virusScanTask = tasks.find(
//     (task) => task.taskType === TASK_TYPES.VIRUS_SCAN
//   );
//   const sendFileTask = tasks.find(
//     (task) => task.taskType === TASK_TYPES.SEND_FILE
//   );
//   return {
//     mediainfoWorker: getQItemMediainfo(mediainfoTask.taskId);
//     ffmpegWorker: getQItemFFmpeg(ffmpegTask.taskId);
//     virusScanWorker: getQItemVirusScan(virusScanTask.taskId);
//     sendFileWorker: getQItemSendFile(sendFileTask.taskId);
//   }
// }

const replaceElement = (array, element, index) => {
  const newArray = [...array];
  newArray[index] = element;
  return newArray;
}

export default function useJobItemState(jobId) {
  const dispatch = useDispatch();
  const job = useSelector((state) =>
    state.job.jobList.find((job) => job.jobId === jobId)
  );
  const { tasks } = job;
  React.useEffect(() => {
  }, [tasks]);
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
  const updateJobTask = React.useCallback((task) => {
      const targetTaskIndex = job.tasks.findIndex(
        (element) => element.taskId === task.taskId
      );
      const tasks = replaceElement(job.tasks, task, targetTaskIndex);
      updateJobState('tasks', tasks);
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
