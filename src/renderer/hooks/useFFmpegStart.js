/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
import React from 'react';
import { clearWorker } from 'renderer/lib/jobUtil';
import { ffmpegQueue } from 'renderer/lib/queueUtil';
import ffmpegProc from 'renderer/lib/ffmpegProc';
import { getAbsolutePath } from 'renderer/lib/electronUtil';

const ffmpegBinary = getAbsolutePath('bin/ffmpeg2018.exe', true);

export default function useFFmpegStart() {
  const [workers, setWorkers] = React.useState({});
  // console.log('### workers =>', workers);
  const startFFmpegQueue = React.useCallback(() => {
    try {
      ffmpegQueue.process(2, async (qItem, done) => {
        try {
          // console.log('!!!!!', qItem)
          const qItemBody = qItem.itemBody;
          console.log('qItemBody:', qItemBody);
          const { jobId, inFile, ffmpegOptions, outFile, totalFrames } = qItemBody;
          const ffmpeg = ffmpegProc(ffmpegBinary);
          const childProcess = ffmpeg.run({
            inFile,
            ffmpegOptions,
            outFile,
            totalFrames
          });
          childProcess.on('done', (code) => {
            clearWorker(jobId, setWorkers);
            if (code === 0) {
              done(null, 'ffmpeg success');
            } else {
              done('ffmpeg failed');
            }
          });
          childProcess.on('spawn', () => {
            setWorkers((workers) => {
              return {
                ...workers,
                [jobId]: ffmpeg,
              }
            });
            qItem.emit('spawn', childProcess.pid);
          });
          childProcess.on('error', (error) => {
            clearWorker(jobId, setWorkers);
            done(error);
          });
          childProcess.on('progress', (progressObj) => {
            qItem.emit('progress', progressObj);
          });
        } catch (err) {
          console.log('errored:', err);
          done(err);
        }
      });
    } catch (err) {
      throw new Error(err);
    }
    return ffmpegQueue;
  }, [setWorkers]);
  return {
    workers,
    startFFmpegQueue,
  };
}
