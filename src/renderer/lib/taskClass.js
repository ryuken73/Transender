/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const { EventEmitter } = require('events');

const getNextId = () => Date.now();

class Task extends EventEmitter {
  constructor(task, queue, taskEvents) {
    super();
    this.taskId = task.taskId || getNextId();
    this.data = task.data;
    this._progress = 0;
    this._logs = [];
    this._priority = task._priority || 999;
    this._ownQueue = queue;
    this.TASK_EVENTS = taskEvents;
  }

  progress(percent) {
    if (percent === undefined) return this._progress;
    this._progress = percent;
    this.emit(this.TASK_EVENTS.PROGRESS, percent);
  }

  logs(log) {
    if (log === undefined) return this._logs;
    this._logs = [...this._logs, log];
  }
}

const createTask = (taskInfo, queue, taskEvents) => {
  return new Task(taskInfo, queue, taskEvents);
};

module.exports = createTask;
