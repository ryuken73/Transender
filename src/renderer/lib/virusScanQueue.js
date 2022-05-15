import { getQueue } from 'renderer/lib/queueClass';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import virusScanProc from 'renderer/lib/virusScanProc';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';

const { JOB_STATUS } = bullConstants;
const { LOG_LEVEL } = constants;
const virusScanBinary = getAbsolutePath('bin/Mediainfo.exe', true);
const virusScan = virusScanProc(virusScanBinary);
const virusScanQueue = getQueue('virusScan', bullConstants);

const getVirusScanQueue = () => virusScanQueue;

const startVirusScanQueue = () => {
  try {
    virusScanQueue.process(1, async (qItem, done) => {
      try {
        console.log('!!!!!', qItem)
        const qItemBody = qItem.itemBody;
        // console.log('qTask.body.args.fullName:', qItemBody.args.fullName);
        const ret = await virusScan.run(qItemBody.inputFile);
        console.log('###', virusScan.getResult())
        done(null, {
          rawResult: virusScan.getResult(),
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
  return virusScanQueue;
};

const addQueue = (task, job) => {
  return virusScanQueue.add({
    ...task,
    inputFile: job.sourceFile.fullName,
    },
    task.taskId
  );
};

module.exports = { getVirusScanQueue, startVirusScanQueue, addQueue };
