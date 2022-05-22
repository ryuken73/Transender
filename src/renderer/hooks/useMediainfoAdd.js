/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
import React from 'react';
import { useSelector } from 'react-redux';
import { getTask, getNextTask, taskUpdater } from 'renderer/lib/jobUtil';
import useJobItemState from 'renderer/hooks/useJobItemState';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import useAppLogState from 'renderer/hooks/useAppLogState';
import useConfig from 'renderer/hooks/useConfig';
import { addMediainfoQueue } from 'renderer/lib/queueUtil';
import { createLogger } from 'renderer/lib/electronUtil';

const { file } = require('renderer/utils');
const { changeDir, changeExtension } = file;

const { FFMPEG_OPTIONS } = constants;
const { JOB_STATUS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

const logger = createLogger('mediainfo');

const makeFFmpegOptions = (video, audio) => {
  const toMxfOption = FFMPEG_OPTIONS.MXF.join(' ');
  // return '-y -acodec copy -progress pipe:1';
  return toMxfOption;
};
const makeFFmpegOutPath = (job, outPath) => {
  const origFile = job.sourceFile.fullName;
  const targetFile = changeDir(
    changeExtension(origFile, '.mxf'),
    outPath
  );
  file
    .checkDirWritable(outPath)
    .then((result) =>
      logger.info('working directory ', FFMPEG_OPTIONS, ' writable!')
    )
    .catch((error) => {
      logger.error(
        error,
        'working directory ',
        FFMPEG_OPTIONS,
        'not exits!. create new one'
      );
      file.makeDirectory(outPath);
    });
  return targetFile;
};

export default function useMediainfoAdd(job) {
  const { jobId } = job;
  const { updateJobTask, updateJobStatusState } = useJobItemState(job);
  const { config } = useConfig();
  const { FFMPEG_TARGET_DIR: outPath } = config;
  const { setAppLogState } = useAppLogState();
  const addMediainfoItem = React.useCallback(
    (task) => {
      const currentTask = getTask(job, task);
      const nextTask = getNextTask(job, task);
      const getCurrentTaskUpdated = taskUpdater(currentTask);
      const getNextTaskUpdated = taskUpdater(nextTask);
      const worker = addMediainfoQueue(task, job);
      worker.on(Q_ITEM_STATUS.ACTIVE, () => {
        // eslint-disable-next-line prettier/prettier
        const activeTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.ACTIVE});
        updateJobTask([activeTask]);
        updateJobStatusState(JOB_STATUS.ACTIVE);
      });
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { rawResult, video, audio } = result;
        // eslint-disable-next-line prettier/prettier
        const completedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.COMPLETED});
        console.log('&&&&', video('FrameCount'));
        const ffmpegOptions = makeFFmpegOptions(video, audio);
        const totalFrames = video('FrameCount')[0];
        const outFile = makeFFmpegOutPath(job, outPath);
        const updatedTask = getNextTaskUpdated({
          inFile: job.sourceFile.fullName,
          ffmpegOptions,
          totalFrames,
          outFile,
        });
        console.log(updatedTask);
        setAppLogState(`Analyze ${job.sourceFile.fullName} success.`);
        updateJobTask([completedTask, updatedTask]);
        updateJobStatusState(JOB_STATUS.READY);
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) => {
        console.log('##### task failed!:', error);
        // eslint-disable-next-line prettier/prettier
        const failedTask = getCurrentTaskUpdated({status: Q_ITEM_STATUS.FAILED});
        setAppLogState(`Analyze ${job.sourceFile.fullName} failed.`);
        updateJobTask([failedTask]);
        updateJobStatusState(JOB_STATUS.FAILED);
      });
    },
    [job, setAppLogState, updateJobStatusState, updateJobTask]
  );

  return { addMediainfoItem };
}
