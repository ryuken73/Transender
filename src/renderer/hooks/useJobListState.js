/* eslint-disable import/named */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateJobs,
  startMediainfoQueue,
  addToMediainfoQueue,
} from 'renderer/Components/Pages/MainTab/jobSlice';
import {
  mediaInfo,
  mediainfoQueue,
  addMediainfoQueue,
} from 'renderer/lib/queueUtil';
import bullConstants from 'renderer/config/bull-constants';
import useJobItemState from './useJobItemState';

const { JOB_STATUS, Q_EVENTS, Q_ITEM_STATUS, Q_WORKER_EVENTS } = bullConstants;

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every((job) => job.checked === true);
  React.useEffect(() => {
    console.log('%%%%% called useJobListState');
    let queue;
    try {
      dispatch(startMediainfoQueue());
    } catch (err) {
      console.error(err);
    }
    return () => {
      console.log('remove event listener', queue);
      if (queue) {
        // remove EventListener of mediaInfo
      }
    };
  }, [dispatch]);

  const addJobsState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
      } else {
        throw new Error('jobs should be Array');
      }
    },
    [dispatch]
  );

  const toggleAllCheckedState = React.useCallback(
    (checked) => {
      dispatch(updateJobs({ key: 'checked', value: checked }));
    },
    [dispatch]
  );

  const removeJobAllCheckedState = React.useCallback(() => {
    const checkedJobs = jobList.filter((job) => job.checked === true);
    checkedJobs.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    });
  }, [dispatch, jobList]);

  const makeFFmpegOptions = (video, audio) => {
    return '-y -acodec copy -progress pipe:1';
  };

  const makeFFmpegOutPath = () => {
    return 'd:/temp/aaa.mp4';
  };

  const addMediainfoItem = React.useCallback(
    (task, job) => {
      const worker = addMediainfoQueue(task, job);
      worker.on(Q_WORKER_EVENTS.COMPLETED, (result) => {
        const { rawResult, video, audio } = result;
        console.log('&&&&', video('Count'));
        const ffmpegOptions = makeFFmpegOptions(video, audio);
        const totalFrames = video('Count')[0];
        const outFile = makeFFmpegOutPath();
      });
      worker.on(Q_WORKER_EVENTS.FAILED, (error) =>
        console.log('##### task failed!:', error)
      );
    },
    [dispatch]
  );

  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
    addMediainfoItem,
  };
}
