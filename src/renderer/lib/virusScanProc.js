const { execFile } = require('child_process');

const virusScan = (binaryPath = `${process.cwd()}/../../bin/virusScan`) => {
  let result = {};
  const run = (inFile) => {
    return new Promise((resolve, reject) => {
      result = { success: true };
      resolve(true);
      // execFile(
      //   binaryPath,
      //   [inFile, '--Output=JSON', '--Full'],
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       reject(error)
      //     }
      //     result = JSON.parse(stdout);
      //     resolve(true);
      //   }
      // );
    });
  };
  const getResult = () => result;

  return {
    run,
    getResult,
  };
};

module.exports = virusScan;
