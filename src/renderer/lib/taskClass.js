/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { getNextId } from 'renderer/utils';

const { EventEmitter } = require('events');

class Task extends EventEmitter {
  constructor(taskBody, queue, taskEvents, taskId, priority) {
    super();
    this._taskId = taskId || getNextId();
    this._body = taskBody;
    this._progress = 0;
    this._logs = [];
    this._priority = priority || 999;
    this._ownQueue = queue;
    this.TASK_EVENTS = taskEvents;
  }

  get taskId() {
    return this._taskId;
  }

  get body() {
    return this._body;
  }

  priority(priority) {
    if (priority === undefined) return this._priority;
    this._priority = priority;
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

const createTask = (taskBody, queue, taskEvents) => {
  return new Task(taskBody, queue, taskEvents);
};

module.exports = createTask;
