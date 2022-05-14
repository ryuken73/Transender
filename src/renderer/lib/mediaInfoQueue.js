import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import { updateJob } from 'renderer/Components/Pages/MainTab/jobSlice';
import { setAppLog } from 'renderer/appSlice';

const { JOB_STATUS } = bullConstants;
const { LOG_LEVEL } = constants;
const mediainfoBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const mediaInfo = mediaInfoProc(mediainfoBinary);
const mediainfoQueue = getQueue('mediaInfo', bullConstants);

const startMediainfoQueue = (dispatch) => {
  try {
    mediainfoQueue.process(10, async (qItem, done) => {
      try {
        console.log('!!!!!', qItem)
        const qItemBody = qItem.itemBody;
        console.log('qTask.body.args.fullName:', qItemBody.args.fullName);
        const ret = await mediaInfo.run(qItemBody.args.fullName);
        const isMediaFile = mediaInfo.isMediaFile();
        console.log('###', mediaInfo.getResult())
        if (isMediaFile) {
          dispatch(
            updateJob({
              jobId: qItem.itemId,
              key: 'status',
              value: JOB_STATUS.READY,
            })
          );
          dispatch(
            setAppLog({ message: `Aanlyze ${qItemBody.args.fullName} done.` })
          );
          done(null, isMediaFile);
        } else {
          dispatch(
            updateJob({
              jobId: qItem.itemId,
              key: 'status',
              value: JOB_STATUS.FAILED,
            })
          );
          dispatch(
            setAppLog({
              level: LOG_LEVEL.ERROR,
              message: `Aanlyze ${qItemBody.args.fullName} Faild.[not-media-file]`,
            })
          )
          done('codec unknows. suspect not media file.')
        }
        return mediainfoQueue;
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
  return mediainfoQueue.add(jobData, jobData.jobId );
};

module.exports = { startMediainfoQueue, addQueue };
