import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';
import { setAppLog } from 'renderer/appSlice';

const { JOB_STATUS } = bullConstants;
const { LOG_LEVEL } = constants;
const mediainfoBinary = getAbsolutePath('src/bin/Mediainfo.exe');
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const startMediainfoQueue = (dispatch) => {
  try {
    mediainfoQueue.process(1, async (qTask, done) => {
      try {
        const qBody = qTask.body;
        console.log('qTask.body.args.fullName:', qBody.args.fullName);
        const ret = await mediaInfo.run(qBody.args.fullName);
        const isMediaFile = mediaInfo.isMediaFile();
        console.log('###', mediaInfo.getResult())
        if (isMediaFile) {
          dispatch(
            updateJob({
              jobId: qBody.jobId,
              key: 'status',
              value: JOB_STATUS.READY,
            })
          );
          dispatch(
            setAppLog({ message: `Aanlyze ${qBody.args.fullName} done.` })
          );
          done(null, ret);
        } else {
          dispatch(
            updateJob({
              jobId: qBody.jobId,
              key: 'status',
              value: JOB_STATUS.FAILED,
            })
          );
          dispatch(
            setAppLog({
              level: LOG_LEVEL.ERROR,
              message: `Aanlyze ${qBody.args.fullName} Faild.[not-media-file]`,
            })
          )
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
