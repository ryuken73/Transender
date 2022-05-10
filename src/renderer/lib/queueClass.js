/* eslint-disable no-underscore-dangle */
const { EventEmitter } = require('events');
const createTask = require('./taskClass');

class Queue extends EventEmitter {
  constructor(name, constants) {
    super();
    this.name = name;
    const { DEFAULT_CONCURRENCY, TASK_STATUS, TASK_EVENTS, QUEUE_EVENTS } = constants;
    this.taskLists = {
      [TASK_STATUS.WAITING]: [],
      [TASK_STATUS.ACTIVE]: [],
      [TASK_STATUS.COMPLETED]: [],
      [TASK_STATUS.FAILED]: [],
      [TASK_STATUS.DELAYED]: [],
    };
    this._worker = null;
    this._concurrency = DEFAULT_CONCURRENCY;
    this.TASK_STATUS = TASK_STATUS;
    this.TASK_EVENTS = TASK_EVENTS;
    this.QUEUE_EVENTS = QUEUE_EVENTS;
  }

  static instances = {};

  static getInstance(name) {
    return Queue.instances[name];
  }

  _getNext = () => {
    const waitTasks = this.taskLists[this.TASK_STATUS.WAITING];
    const nextTask = waitTasks[0];
    this._removeTaskStatus(nextTask, this.TASK_STATUS.WAITING);
    return nextTask;
  };

  add = (task) => {
    const newTask = createTask(task, this, this.TASK_EVENTS);
    this._setTaskStatus(newTask, this.TASK_STATUS.WAITING);
    this.runNextTask();
  };

  _removeTaskStatus = (task, taskStatus) => {
    const fromList = this.taskLists[taskStatus];
    this.taskLists[taskStatus] = fromList.filter(
      (fromtask) => fromtask.taskId !== task.taskId
    );
  };

  _setTaskStatus = (task, taskStatus) => {
    const targetList = this.taskLists[taskStatus];
    this.taskLists[taskStatus] = [...targetList, task];
  };

  _movetaskStatus = (task, fromStatus, toStatus) => {
    this._removeTaskStatus(task, fromStatus);
    this._setTaskStatus(task, toStatus);
  };

  done = (task) => {
    return (error, result) => {
      if (error) {
        this._movetaskStatus(
          task,
          this.TASK_STATUS.ACTIVE,
          this.TASK_STATUS.FAILED
        );
        this.emit(this.QUEUE_EVENTS.FAILED, task.taskId, error);
        this.runNextTask();
        return;
        // throw error;
      }
      this._movetaskStatus(
        task,
        this.TASK_STATUS.ACTIVE,
        this.TASK_STATUS.COMPLETED
      );
      this.emit(this.QUEUE_EVENTS.COMPLETED, task.taskId, result);
      this.runNextTask();
    };
  };

  runNextTask = () => {
    if (this._worker === null) return;
    console.log(
      `waiting: ${this.getWaitCount()} active: ${this.getActiveCount()} completed: ${this.getCompletedCount()} failed: ${this.getFailedCount()}`
    );
    if (this.getActive().length >= this._concurrency) return;
    const nexttask = this._getNext();
    if (nexttask === undefined) {
      this.emit('drained');
    } else {
      this._setTaskStatus(nexttask, this.TASK_STATUS.ACTIVE);
      nexttask.on(this.TASK_EVENTS.PROGRESS, (progress) =>
        this.emit(this.QUEUE_EVENTS.PROGRESS, nexttask, progress)
      );
      this.emit(this.QUEUE_EVENTS.ACTIVE, nexttask, this.done(nexttask));
    }
  };

  gettask = (taskId) => this.tasks.find((task) => task.taskId === taskId);

  gettasks = (status) => this.taskLists[status];

  getActive = () => this.taskLists[this.TASK_STATUS.ACTIVE];

  getWaitCount = () => this.taskLists[this.TASK_STATUS.WAITING].length;

  getActiveCount = () => this.taskLists[this.TASK_STATUS.ACTIVE].length;

  getCompletedCount = () => this.taskLists[this.TASK_STATUS.COMPLETED].length;

  getFailedCount = () => this.taskLists[this.TASK_STATUS.FAILED].length;

  empty = () => (this.taskLists[this.TASK_STATUS.WAITING] = []);

  gettaskLogs = (taskId) => {
    const task = this.gettask(taskId);
    if (task) return task.logs;
  };

  _registerWorker(worker) {
    if (this._worker !== null) {
      return false;
    }
    this._worker = worker;
    return true;
  }

  _parseArgs = (args) => {
    if (typeof args[0] === 'number') {
      return [args[0], args[1]];
    }
    return [this.DEFAULT_CONCURRENCY, args[0]];
  };

  process(...args) {
    const [concurrency, worker] = this._parseArgs(args);
    this._concurrency = concurrency;
    const registered = this._registerWorker(worker);
    if (registered) {
      this.on(this.QUEUE_EVENTS.ACTIVE, this._worker);
      // invoke task which added before calling process()
      this.runNextTask();
    } else {
      throw new Error('duplicate processors. run Queue.clearProcessor() first');
    }
  }
}

const createQueue = (queueName, constants) => {
  const instance = Queue.getInstance(queueName);
  if (instance) {
    console.log('return existing queue:', queueName);
    return instance;
  }
  Queue.instances[queueName] = new Queue(queueName, constants);
  return Queue.instances[queueName];
};

const getQueue = createQueue;

module.exports = {
  createQueue,
  getQueue
};
