/* eslint-disable promise/always-return */
/* eslint-disable prettier/prettier */
const EventEmitter = require('events');
const http = require('http');
const fs = require('fs');
const { file } = require('../utils');

const sendFile = () => {
  let eventEmitter;
  let controller;
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
    const rStream = fs.createReadStream(inFile, { highWaterMark: 1024 * 1024 });
    const req = http.request(options, res => {
      res.on('data', chunk => {
        console.log(chunk.toString());
      })
      res.on('end', () => {
        eventEmitter.emit('done');
      })
    });
    const handleError = error => {
      console.error(error)
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
    console.error(error);
    eventEmitter.emit('error', error)
  })

    return eventEmitter;
  };

  const stop = () => {
    console.log('request aborted!!')
    controller.abort();
  };
  return { run, stop, };
};

module.exports = sendFile;
