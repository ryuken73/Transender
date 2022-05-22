const dev =  {
  LOG_LEVEL: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  },
  DEFAULT_CUSTOM_CONFIG_NAME: 'jin-transender',
  SOCKET_SERVER_URL: 'http://localhost:9009',
  EVENT_NEW_MESSAGES: 'post:newMessages',
  MEDIAINFO_BIN: '',
  SEND_HOSTNAME: 'localhost',
  SEND_PORT: 7000,
  SEND_URI_PATH: '/sendFile',
  FFMPEG_OPTIONS: {
    MXF: [
      '-r ntsc -c:v mpeg2video -profile:v 0 -level:v 2 -b:v 50000k -maxrate 50000k -minrate 50000k',
      '-bufsize 20000k -flags +ildct+ilme -top 1 -g 15 -bf 2 -color_primaries 1 -color_trc 1 -colorspace 1',
      '-filter_complex [0:v]format=pix_fmts=yuv422p[vformat];[vformat]scale=w=1920:h=1080:interl=0[v1];[v1]setfield=tff[v2];[v2]fps=29.97',
      '-an -y -max_delay 0 -shortest -max_interleave_delta 1000000000 -progress pipe:1',
    ],
  },
};

const prd = {
  ...dev,
  SEND_HOSTNAME: '10.40.254.51',
};

export default process.env.NODE_ENV === 'development' ? dev:prd;
