const sendFileBin = require('./sendFileProc');

const main = () => {
  const sendFileProc = sendFileBin();
  const sendFile = sendFileProc.run({
    inFile: 'd:/temp/night8.mp4',
    hostname: 'localhost',
    port: 7000,
    path: '/sendFile/k.mp4',
  });
  sendFile.on('progress', (progress) => console.log(progress));
  sendFile.on('error', error => {
    console.log('error on cli:', error)
  })
  process.stdin.on('data', (data) => {
    console.log(data.sent);
    sendFileProc.stop();
  });
};

main();
