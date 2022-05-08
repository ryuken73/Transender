const CONSTANTS = {
  DEFAULT_CONCURRENCY: 2,
  TASK_TYPES: {
    TRANSCODE: 'transcode',
    VIRUS_SCAN: 'virusScan',
    SEND_FILE: 'sendFile',
  },
  JOB_STATUS: {
    READY: 'ready',
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'faild',
    DELAYED: 'delayed',
  },
  TASK_EVENTS: {
    PROGRESS: 'progress',
    WAITING: 'waiting',
  },
  TASK_STATUS: {
    READY: 'ready',
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'faild',
    DELAYED: 'delayed',
  },
  QUEUE_EVENTS: {
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
  }
}

CONSTANTS.TASK_DEFAULT = {
  [CONSTANTS.TASK_TYPES.TRANSCODE]: {},
  [CONSTANTS.TASK_TYPES.VIRUS_SCAN]: {},
  [CONSTANTS.TASK_TYPES.SEND_FILE]: {},
}

CONSTANTS.DEFAULT_TASK_FLOW = [
  CONSTANTS.TASK_TYPES.TRANSCODE,
  CONSTANTS.TASK_TYPES.VIRUS_SCAN,
  CONSTANTS.TASK_TYPES.SEND_FILE,
]


export default CONSTANTS;
