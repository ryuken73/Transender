/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { getNextId } from 'renderer/utils';

const { EventEmitter } = require('events');

class Q_ITEM extends EventEmitter {
  constructor(qItemBody, queue, qItemId, priority) {
    super();
    this._qItemId = qItemId || getNextId();
    this._qItemBody = qItemBody;
    this._qItemProgress = 0;
    this._qItemLogs = [];
    this._qItemPriority = priority || 999;
    this._ownQueue = queue;
  }

  get itemId() {
    return this._qItemId;
  }

  get itemBody() {
    return this._qItemBody;
  }

  priority(priority) {
    if (priority === undefined) return this._qItemPriority;
    this._qItemPriority = priority;
  }

  progress(percent) {
    if (percent === undefined) return this._qItemProgress;
    this._qItemProgress = percent;
    this.emit('progress', percent);
  }

  logs(log) {
    if (log === undefined) return this._qItemLogs;
    this._qItemLogs = [...this._qItemLogs, log];
  }
}

const createQItem = (itemBody, queue, itemId) => {
  return new Q_ITEM(itemBody, queue, itemId);
};

module.exports = createQItem;
