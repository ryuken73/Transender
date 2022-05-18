import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import sendFileProc from 'renderer/lib/sendFileProc';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';

const { JOB_STATUS } = bullConstants;
const { LOG_LEVEL } = constants;
const sendFileBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const sendFile = sendFileProc(sendFileBinary);
const sendFileQueue = getQueue('sendFile', bullConstants);

const getSendFileQueue = () => sendFileQueue;

const startSendFileQueue = () => {
  try {
    sendFileQueue.process(1, async (qItem, done) => {
      try {
        console.log('!!!!!', qItem)
        const qItemBody = qItem.itemBody;
        // console.log('qTask.body.args.fullName:', qItemBody.args.fullName);
        const ret = await sendFile.run(qItemBody.inFile);
        console.log('###', sendFile.getResult())
        done(null, {
          rawResult: sendFile.getResult(),
        });
      } catch(err){
        console.log('errored:', err);
        done(err)
      }
    })
  } catch (err) {
    throw new Error(err);
    // console.log(err);
  }
  return sendFileQueue;
};

const addQueue = (task, job) => {
  return sendFileQueue.add({
    ...task,
    inFile: job.sourceFile.fullName,
    },
    task.taskId
  );
};

module.exports = { getSendFileQueue, startSendFileQueue, addQueue };
