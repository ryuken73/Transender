/* eslint-disable promise/always-return */
/* eslint-disable prettier/prettier */
const EventEmitter = require('events');
const http = require('http');
const fs = require('fs');
const { file } = require('../utils');

const sendFileProc = () => {
  let eventEmitter;
  let controller;
  let rStream;
  const run = ({ inFile, hostname, port, path }) => {
    console.log(`sendFile start:`, inFile, hostname, port, path);
    eventEmitter = new EventEmitter();
    controller = new AbortController();
    const { signal } = controller;
    // const fileSize = await file.getSize(inFile);
    const options = {
      hostname,
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      signal,
    };
    try {
      rStream = fs.createReadStream(inFile, { highWaterMark: 1024 * 1024 });
    } catch(error) {
      throw Error(error);
    }
    const req = http.request(options, res => {
      res.on('data', chunk => {
        console.log(chunk.toString());
      })
      res.on('end', () => {
        eventEmitter.emit('done');
      })
    });
    const handleError = error => {
      console.error('http.request error handler', error);
      if(error.code === 'ABORT_ERR'){
        console.log('user aborted');
      }
      rStream.unpipe();
      rStream.destroy()
      eventEmitter.emit('error', error);
    }
    req.on('error', handleError);

    rStream.on('end', () => {
      req.end();
    });
    file.getSize(inFile).then((fileSize) => {
      rStream.on('data', (chunk) => {
        req.write(chunk);
        eventEmitter.emit('progress', {
          totalSize: fileSize,
          sent: rStream.bytesRead
        })
      });
    })
    .catch(error => {
      console.error('rStrem read and request write error catch block:',error);
      rStream.unpipe();
      rStream.destroy()
      eventEmitter.emit('error', error)
    })

    return eventEmitter;
  };

  const stop = () => {
    console.log('request aborted!!')
    rStream.unpipe();
    controller.abort();
  };
  return { run, stop, };
};

module.exports = sendFileProc;
