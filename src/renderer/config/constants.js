const dev =  {
  LOG_LEVEL: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  },
  SOCKET_SERVER_URL: 'http://localhost:9009',
  EVENT_NEW_MESSAGES: 'post:newMessages',
  MEDIAINFO_BIN: '',
};

const prd = {
  ...dev,
};

export default process.env.NODE_ENV === 'development' ? dev:prd;
