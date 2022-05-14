import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import ffmpegBin from 'renderer/lib/ffmpegBin';
import bullConstants from 'renderer/config/bull-constants';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';

const { JOB_STATUS } = bullConstants;
const ffmpegBinary = getAbsolutePath('src/bin/ffmpeg2018.exe');
const ffmpeg = ffmpegBin(ffmpegBinary);
const ffmpegQueue = getQueue('ffmpeg', bullConstants);

const startFFmpegQueue = (dispatch) => {
  try {
    ffmpegQueue.process(1, async (qTask, done) => {
      try {
        const qBody = qTask.body;
        console.log('jobInfo:', qBody.args);
        // qBody = {inFile, ffmpegOptions, outFile, totalFrames}
        const ret = await ffmpeg.run(qBody.args);
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
      return ffmpegQueue;
    })
  } catch (err) {
    console.log(err);
  }
};

const addQueue = (jobData) => {
  ffmpegQueue.add(jobData);
};

module.exports = { startFFmpegQueue, addQueue };
