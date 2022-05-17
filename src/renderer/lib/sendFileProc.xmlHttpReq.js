// there is no way to make blob object by node.js fs, stream module.
// xmlHttpRequest gives well defined progress event.
// and should be used in browser mode where blob of file can be easily created
import { EventEmitter } from 'events';
const sendFile = () => {
  let worker;
  const run = (inFile, targetAddress, protocol='http') => {
    worker = new Event();
    const updateProgress = (event) => {
      if(event.lengthComputable){
        const progress = event.loaded / event.total * 100;
        worker.emit('progress', progress);
      }
    };
    const transferComplete = () => {
      console.log('done');
    }
    const handleError = (error) => {
      console.error(error)
    }
    const handleAbort = () => {
      console.error('aborted')
    }
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', updateProgress);
    xhr.upload.addEventListener('load', transferComplete);
    xhr.upload.addEventListener('error', handleError);
    xhr.upload.addEventListener('abort', handleAbort);

    worker.on('stop', () => req.abort();)

    return worker;
    });
  };

  const stop = () => {
    worker.emit('stop')
  }
  return {
    run,
  };
};

module.exports = sendFile;
