import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import bullConstants from 'renderer/config/bull-constants';
import {
  addJob,
  addJobs,
  removeJob,
  updateJob,
  updateJobs,
} from 'renderer/Components/Pages/MainTab/jobSlice';

const { JOB_STATUS } = bullConstants;
const mediainfoBinary = getAbsolutePath('src/bin/Mediainfo.exe');
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

export default function useJobListState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  const allChecked = jobList.every(job => job.checked === true);
  React.useEffect(() => {
    try {
      mediainfoQueue.process(1, async (job, done) => {
        try {
          console.log('jobInfo:', job.data.args.fullName);
          const jobInfo = job.data;
          const ret = await mediaInfo.run(jobInfo.args.fullName);
          const isMediaFile = mediaInfo.isMediaFile();
          console.log('###', mediaInfo.getResult())
          if (isMediaFile) {
            dispatch(
              updateJob({
                jobId: jobInfo.jobId,
                key: 'status',
                value: JOB_STATUS.READY,
              })
            );
            done(null, ret);
          } else {
            dispatch(
              updateJob({
                jobId: jobInfo.jobId,
                key: 'status',
                value: JOB_STATUS.FAILED,
              })
            );
            done('codec unknows. suspect not media file.')
          }
        } catch(err){
          console.log('errored:', err);
          done(err)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }, [dispatch])
  const addJobsState = React.useCallback(
    (jobs) => {
      if (Array.isArray(jobs)) {
        dispatch(addJobs({ jobs }));
        jobs.forEach((job) => {
          // dispatch(addJob({ job }));
          mediainfoQueue.add({ data: job });
        });
      } else {
        throw new Error('jobs should be Array')
      }
    },
    [dispatch]
  );
  const toggleAllCheckedState = React.useCallback((checked) => {
      dispatch(updateJobs({ key: 'checked', value: checked }));
    },
    [dispatch]
  );
  const removeJobAllCheckedState = React.useCallback(() => {
    const checkedJobs = jobList.filter((job) => job.checked === true);
    checkedJobs.forEach((job) => {
      dispatch(removeJob({ jobId: job.jobId }));
    })
  }, [dispatch, jobList]);
  return {
    jobList,
    allChecked,
    addJobsState,
    toggleAllCheckedState,
    removeJobAllCheckedState,
  };
}
