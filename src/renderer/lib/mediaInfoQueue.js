import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import bullConstants from 'renderer/config/bull-constants';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';

const { JOB_STATUS } = bullConstants;
const mediainfoBinary = getAbsolutePath('src/bin/Mediainfo.exe');
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const startMediainfoQueue = (dispatch) => {
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
};

const addQueue = (jobData) => {
  mediainfoQueue.add(jobData);
};

module.exports = { startMediainfoQueue, addQueue };
