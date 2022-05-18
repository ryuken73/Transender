const CONSTANTS = {
  DEFAULT_CONCURRENCY: 2,
  TASK_TYPES: {
    MEDIAINFO: 'mediainfo',
    TRANSCODE: 'transcode',
    VIRUS_SCAN: 'virusScan',
    SEND_FILE: 'sendFile',
  },
  JOB_STATUS: {
    STANDBY: 'standby', // ready to run next task
    READY: 'ready',  // ready to run next task (previus task success)
    WAITING: 'waiting', // one of task is wait in queue
    ACTIVE: 'active', // one of task is active
    COMPLETED: 'done', // all task done
    FAILED: 'failed', // some task failed
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
    PROGRESS: 'progress',
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
  },
  [CONSTANTS.TASK_TYPES.TRANSCODE]: {
    autoStart: false,
    ffmpegOptions: '',
    totalFrames: null,
    outFile: '',
  },
  [CONSTANTS.TASK_TYPES.VIRUS_SCAN]: {
    inFile: '',
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
