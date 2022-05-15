const CONSTANTS = {
  DEFAULT_CONCURRENCY: 2,
  TASK_TYPES: {
    MEDIAINFO: 'mediainfo',
    TRANSCODE: 'transcode',
    VIRUS_SCAN: 'virusScan',
    SEND_FILE: 'sendFile',
  },
  JOB_STATUS: {
    STANDBY: 'standby',
    READY: 'ready',
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'faild',
    DELAYED: 'delayed',
  },
  // TASK_EVENTS: {
  //   PROGRESS: 'progress',
  //   WAITING: 'waiting',
  //   COMPLETED: 'completed',
  //   FAILED: 'faild',
  // },
  // TASK_STATUS: {
  //   STANDBY: 'standby',
  //   READY: 'ready',
  //   WAITING: 'waiting',
  //   ACTIVE: 'active',
  //   COMPLETED: 'completed',
  //   FAILED: 'faild',
  //   DELAYED: 'delayed',
  // },
  Q_ITEM_STATUS: {
    STANDBY: 'standby',
    READY: 'ready',
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'failed',
    DELAYED: 'delayed',
  },
  Q_WORKER_EVENTS: {
    PROGRESS: 'progress',
    WAITING: 'waiting',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },
  Q_EVENTS: {
    ERROR: 'error',
    WAITING: 'waiting',
    ACTIVE: 'active',
    STALLED: 'stalled',
    PROGRESS: 'progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    PAUSED: 'paused',
    RESUMED: 'resumed',
    CLEANED: 'cleaned',
    DRAINED: 'drained',
    REMOVED: 'removed',
  },
};

CONSTANTS.TASK_DEFAULT = {
  [CONSTANTS.TASK_TYPES.MEDIAINFO]: {
    autoStart: true,
    input: { inputFile: ' ' },
    output: { totalFrames: 0 },
  },
  [CONSTANTS.TASK_TYPES.TRANSCODE]: {
    autoStart: false,
    input: { inputFile: '', totalFrames: 0, outputFile: ''},
    output: { outputFile: ''}
  },
  [CONSTANTS.TASK_TYPES.VIRUS_SCAN]: {
    input: ['outFile'],
    autoStart: true,
  },
  [CONSTANTS.TASK_TYPES.SEND_FILE]: {
    autoStart: true,
  },
};

CONSTANTS.DEFAULT_TASK_FLOW = [
  CONSTANTS.TASK_TYPES.MEDIAINFO,
  CONSTANTS.TASK_TYPES.TRANSCODE,
  CONSTANTS.TASK_TYPES.VIRUS_SCAN,
  CONSTANTS.TASK_TYPES.SEND_FILE,
];

export default CONSTANTS;
