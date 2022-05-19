/* eslint-disable import/named */
import React from 'react';
import { mediaInfo, mediainfoQueue } from 'renderer/lib/queueUtil';

export default function useMediainfoStart() {
  const startMediainfoQueue = React.useCallback(() => {
    try {
      mediainfoQueue.process(3, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const ret = await mediaInfo.run(qItemBody.inFile);
          const isMediaFile = mediaInfo.isMediaFile();
          console.log('###', mediaInfo.getResult())
          if (isMediaFile) {
            done(null, {
              isMediaFile,
              rawResult: mediaInfo.getResult(),
              video: mediaInfo.getStreams('Video'),
              audio: mediaInfo.getStreams('Audio'),
            });
          } else {
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
  });

  return { startMediainfoQueue, };
}
