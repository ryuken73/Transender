import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import constants from 'renderer/config/constants';
import { setAppLog } from 'renderer/appSlice';
import {
  mediaInfo,
  mediainfoQueue,
} from 'renderer/lib/queueUtil';

const { LOG_LEVEL } = constants;

export default function useMediainfoStart() {
  const dispatch = useDispatch();
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
            dispatch(
              setAppLog({ message: `Aanlyze ${qItemBody.inFile} done.` })
            );
            done(null, {
              isMediaFile,
              rawResult: mediaInfo.getResult(),
              video: mediaInfo.getStreams('Video'),
              audio: mediaInfo.getStreams('Audio'),
            });
          } else {
            dispatch(
              setAppLog({
                level: LOG_LEVEL.ERROR,
                message: `Aanlyze ${qItemBody.inFile} Failed.[not-media-file]`,
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
  });

  return { startMediainfoQueue, };
}
