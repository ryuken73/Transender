/* eslint-disable import/named */
import React from 'react';
import { virusScan, virusScanQueue } from 'renderer/lib/queueUtil';

export default function useVirusScanStart() {
  const startVirusScanQueue = React.useCallback(() => {
    try {
      virusScanQueue.process(1, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          await virusScan.run(qItemBody.inFile);
          const result = virusScan.getResult();
          console.log('###', result);
          if (result.success) {
            // dispatch(
            //   setAppLog({ message: `virus scan ${qItemBody.inFile} done.` })
            // );
            done(null, {
              inFile: qItemBody.inFile,
            });
          } else {
            // dispatch(
            //   setAppLog({
            //     level: LOG_LEVEL.ERROR,
            //     message: `virus found [${qItemBody.inFile}]`,
            //   })
            // )
            done('unexpected error');
          }
        } catch (err) {
          console.log('errored:', err);
          done(err);
        }
      })
    } catch (err) {
      throw new Error(err);
      // console.log(err);
    }
    return virusScanQueue;
  }, []);

  return {
    startVirusScanQueue,
  };
};
