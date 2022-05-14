import { getNextId } from 'renderer/utils';
import JOB_CONSTANTS from 'renderer/config/bull-constants';

const { JOB_STATUS, Q_ITEM_STATUS, TASK_DEFAULT } = JOB_CONSTANTS;

const createTask = (taskInfo, index) => {
  const { jobId, taskType } = taskInfo;
  return {
    jobId,
    taskId: getNextId(),
    taskType,
    status: Q_ITEM_STATUS.STANDBY,
    progress: 0,
  }
};

const createJob = (jobInfo) => {
  const { taskFlow = [], args } = jobInfo;
  const jobId = getNextId();
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
    status: JOB_STATUS.STANDBY,
    checked: false,
    args,
  };
};

export default createJob;
