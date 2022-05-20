/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import useMediainfoAdd from 'renderer/hooks/useMediainfoAdd';
import useFFmpegAdd from 'renderer/hooks/useFFmpegAdd';
import useVirusScanAdd from 'renderer/hooks/useVirusScanAdd';
import useSendFileAdd from 'renderer/hooks/useSendFileAdd';
import useJobItemState from 'renderer/hooks/useJobItemState';
import bullConstants from 'renderer/config/bull-constants';
import { getNextStandbyTask } from 'renderer/lib/jobUtil';
import { removeQItemFromQueue } from 'renderer/lib/queueUtil';

const { JOB_STATUS, TASK_TYPES, Q_ITEM_STATUS } = bullConstants;

export default function useTaskInJob(job) {
  const { addMediainfoItem } = useMediainfoAdd(job);
  const { addFFmpegItem } = useFFmpegAdd(job);
  const { addVirusScanItem } = useVirusScanAdd(job);
  const { addSendFileItem } = useSendFileAdd(job);
  const {
    updateJobStatusState,
    updateJobManualStarted,
    currentActiveTaskType,
  } = useJobItemState(job);

  const addMethods = React.useMemo(() => {
    return {
      mediainfo: addMediainfoItem,
      transcode: addFFmpegItem,
      virusScan: addVirusScanItem,
      sendFile: addSendFileItem,
    };
  }, [addMediainfoItem, addFFmpegItem, addVirusScanItem, addSendFileItem]);
  const addStandbyTaskToQueue = React.useCallback(
    (task, job) => {
      console.log('*** in startStandybTask');
      const { taskType } = task;
      const addQueue = addMethods[taskType];
      updateJobStatusState(JOB_STATUS.WAITING);
      console.log('~~~~ add new task', task);
      addQueue(task, job);
    },
    [addMethods, updateJobStatusState]
  );
  const startTask = React.useCallback(() => {
    // prevous task should not be in standby state
    console.log('*** examine job', job);
    const task = getNextStandbyTask(job);
    console.log('*** next standby task is ', task);
    if (task === undefined) return;
    if (task.autoStart || job.manualStarted) {
      console.log('~~~~ startStandbyTask', task);
      addStandbyTaskToQueue(task, job);
    }
  }, [job, addStandbyTaskToQueue]);
  const cancelTask = React.useCallback(
    (props) => {
      const { ffmpegWorker, sendFileWorker } = props;
      console.log(
        '#### cancelTask',
        currentActiveTaskType,
        ffmpegWorker,
        sendFileWorker
      );
      currentActiveTaskType === TASK_TYPES.TRANSCODE && ffmpegWorker.stop();
      currentActiveTaskType === TASK_TYPES.SEND_FILE && sendFileWorker.stop();
    },
    [currentActiveTaskType]
  );
  const backToReady = React.useCallback(
    (job) => {
      updateJobManualStarted(false);
      updateJobStatusState(JOB_STATUS.READY);
      const nextTask = getNextStandbyTask(job);
      removeQItemFromQueue(nextTask);
    },
    [updateJobManualStarted, updateJobStatusState]
  );

  return { startTask, cancelTask, backToReady };
}
