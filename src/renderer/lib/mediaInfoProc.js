const { execFile } = require('child_process');

const mediaInfo = (binaryPath = `${process.cwd()}/../../bin/mediainfo.exe`) => {
  let result = {};
  const run = (inFile) => {
    return new Promise((resolve, reject) => {
      execFile(
        binaryPath,
        [inFile, '--Output=JSON', '--Full'],
        (error, stdout, stderr) => {
          if (error) {
            reject(error)
          }
          result = JSON.parse(stdout);
          resolve(true);
        }
      );
    });
  };
  const getResult = () => result;
  const getNumTracks = () => result.media.track.length;
  const getGeneral = (key) => {
    const general = result.media.track.find(
      (info) => info['@type'] === 'General'
    );
    if (key === undefined) return general;
    return general[key];
  };
  const getStreams = (type='Video') => {
    return (key) => {
      const streams = result.media.track.filter(
        (info) => info['@type'] === type
      );
      if (key === undefined) return streams;
      return streams.map((stream) => stream[key]);
    };
  };
  const isMediaFile = () => {
    return !!getGeneral('CodecID') || !!getGeneral('InternetMediaType');
  };

  return {
    run,
    isMediaFile,
    getResult,
    getNumTracks,
    getGeneral,
    getStreams,
  };
};

module.exports = mediaInfo;
