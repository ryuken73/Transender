/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
import React from 'react';
import { clearWorker } from 'renderer/lib/jobUtil';
import constants from 'renderer/config/constants';
import { sendFileQueue } from 'renderer/lib/queueUtil';
import sendFileProc from 'renderer/lib/sendFileProc';
import bullConstants from 'renderer/config/bull-constants';

const path = require('path');

const { SEND_HOSTNAME, SEND_PORT, SEND_URI_PATH } = constants;
const { Q_ITEM_STATUS } = bullConstants;

const mkOutFile = (inFile) => {
  const inBasename = path.basename(inFile);
  const inExt = path.extname(inBasename);
  const outNoExt = inBasename.replace(inExt, `_${Date.now()}`);
  return `${outNoExt}${inExt}`;
};

export default function useSendFileStart() {
  const [workers, setWorkers] = React.useState({});
  const startSendFileQueue = React.useCallback(() => {
    try {
      sendFileQueue.process(3, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const { jobId, inFile } = qItemBody;
          const outFile = mkOutFile(qItemBody.inFile);
          console.log('^^ outFile:', outFile);
          const sendFile = sendFileProc();
          const worker = sendFile.run({
            inFile,
            hostname: SEND_HOSTNAME,
            port: SEND_PORT,
            path: `${SEND_URI_PATH}/${outFile}`,
          });
          setWorkers((workers) => {
            return {
              ...workers,
              [jobId]: sendFile,
            }
          });
          worker.on('done', () => {
            clearWorker(jobId, setWorkers);
            done(null, {
              inFile: qItemBody.inFile,
            });
          });
          worker.on('error', (error) => {
            clearWorker(jobId, setWorkers);
            done(error);
          });
          worker.on('progress', (progressObj) => {
            // console.log('@@@@@ progress:', progressObj);
            qItem.emit('progress', progressObj);
          })
        } catch (error) {
          console.log('errored:', error);
          done(error);
        }
      })
    } catch (error) {
      throw new Error(error);
      // console.log(err);
    }
    return sendFileQueue;
  }, [setWorkers]);

  return {
    workers,
    startSendFileQueue,
  };
}
