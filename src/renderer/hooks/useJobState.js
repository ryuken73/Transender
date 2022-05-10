import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import bullConstants from 'renderer/config/bull-constants';
import {
  addJob,
  addJobs,
  updateJob,
} from 'renderer/Components/Pages/MainTab/jobSlice';

const { JOB_STATUS } = bullConstants;
const mediainfoBinary = getAbsolutePath('src/bin/Mediainfo.exe');
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

export default function useAppState() {
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.job.jobList);
  React.useEffect(() => {
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
  return { jobList, addJobsState };
}
