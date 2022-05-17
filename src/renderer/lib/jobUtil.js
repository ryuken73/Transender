import { getNextId } from 'renderer/utils';
import JOB_CONSTANTS from 'renderer/config/bull-constants';

const { JOB_STATUS, Q_ITEM_STATUS, TASK_DEFAULT } = JOB_CONSTANTS;

const createTask = (taskInfo, index) => {
  const { jobId, taskType } = taskInfo;
  return {
    jobId,
    taskId: getNextId(),
    status: Q_ITEM_STATUS.STANDBY,
    progress: 0,
    ...taskInfo
  }
};

export const createJob = (jobInfo) => {
  const { taskFlow = [], sourceFile } = jobInfo;
  const jobId = getNextId();
  const tasks = taskFlow.map((taskType, index) => {
    const taskInfo = {
      jobId,
      taskType,
      ...TASK_DEFAULT[taskType],
    }
    return createTask(taskInfo, index);
  });
  console.log('---------------', tasks)
  return {
    jobId,
    tasks,
    status: JOB_STATUS.STANDBY,
    checked: true,
    manualStarted: false,
    sourceFile,
  };
};

export const getTask = (job, task) => {
  return job.tasks.find((ele) => ele.taskId === task.taskId);
};
export const getNextStandbyTask = (job) => {
  return job.tasks.find((task) => task.status === Q_ITEM_STATUS.STANDBY);
};

export const getNextTask = (job, task) => {
  const index = job.tasks.findIndex((ele) => ele.taskId === task.taskId);
  if (index + 1 > job.tasks.length || index === -1) {
    return null;
  }
  return job.tasks[index + 1];
};
