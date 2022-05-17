
// this works, but use huge memory, when upload large size file.
const EventEmitter = require('events');
const fs = require('fs');
const axios = require('axios');
const sendFile = () => {
  let eventEmitter;
  let controller;
  const run = ({inFile, targetAddress, protocol='http'}) => {
    eventEmitter = new EventEmitter();
    controller = new AbortController();
    const updateProgress = (event) => {
      console.log(event)
      // const progress = event.loaded / event.total * 100;
      eventEmitter.emit('progress', progress);
    }

    axios({
      method: 'post',
      url: targetAddress,
      headers: {'Content-type': 'application/octet-stream'},
      data: fs.createReadStream(inFile),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onUploadProgress: updateProgress,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      })
    return eventEmitter;
  };

  const stop = () => { controller.abort(); }
  return { run, stop, };
};

module.exports = sendFile;
