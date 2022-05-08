import JOB_CONSTANTS from 'renderer/config/bull-constants';

const { JOB_STATUS, TASK_STATUS, TASK_DEFAULT } = JOB_CONSTANTS;

const createTask = (taskInfo, index) => {
  const { jobId, taskType } = taskInfo;
  return {
    jobId,
    taskId: Date.now() + index,
    taskType,
    status: TASK_STATUS.READY,
    progress: 0,
  }
};

const createJob = (jobInfo) => {
  const { taskFlow = [], args } = jobInfo;
  const jobId = Date.now();
  const tasks = taskFlow.map((taskType, index) => {
    const taskInfo = {
      jobId,
      taskType,
      ...TASK_DEFAULT[taskType]
    }
    return createTask(taskInfo, index);
  });
  return {
    jobId,
    tasks,
    status: JOB_STATUS.READY,
    args
  };
};

export default createJob;
