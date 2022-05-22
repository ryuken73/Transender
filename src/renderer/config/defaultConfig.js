const dev = {
  FFMPEG_TARGET_DIR: 'c:/temp/transender',
};

const prd = {
  ...dev,
};

export default process.env.NODE_ENV === 'development' ? dev : prd;
