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
    mediainfoQueue.process(1, async (qItem, done) => {
      try {
        console.log('!!!!!', qItem)
        const qItemBody = qItem.itemBody;
        // console.log('qTask.body.args.fullName:', qItemBody.args.fullName);
        const ret = await mediaInfo.run(qItemBody.inputFile);
        const isMediaFile = mediaInfo.isMediaFile();
        console.log('###', mediaInfo.getResult())
        if (isMediaFile) {
          dispatch(
            updateJob({
              jobId: qItemBody.jobId,
              key: 'status',
              value: JOB_STATUS.READY,
            })
          );
          dispatch(
            setAppLog({ message: `Aanlyze ${qItemBody.inputFile} done.` })
          );
          done(null, { isMediaFile, getResult: mediaInfo.getResult, getVideo: mediaInfo.getStreams('Video') });
        } else {
          dispatch(
            updateJob({
              jobId: qItemBody.jobId,
              key: 'status',
              value: JOB_STATUS.FAILED,
            })
          );
          dispatch(
            setAppLog({
              level: LOG_LEVEL.ERROR,
              message: `Aanlyze ${qItemBody.inputFile} Faild.[not-media-file]`,
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
    throw new Error(err);
    // console.log(err);
  }
  return mediainfoQueue;
};

const addQueue = (task, job) => {
  return mediainfoQueue.add({
    ...task,
    inputFile: job.sourceFile.fullName,
    },
    task.taskId
  );
};

module.exports = { startMediainfoQueue, addQueue };
