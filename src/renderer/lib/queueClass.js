/* eslint-disable no-underscore-dangle */
const { EventEmitter } = require('events');
const createQItem = require('./qItemClass');

class Queue extends EventEmitter {
  constructor(name, constants) {
    super();
    const { DEFAULT_CONCURRENCY, Q_ITEM_STATUS, Q_WORKER_EVENTS, Q_EVENTS } = constants;
    this.name = name;
    this.qItemList = {
      [Q_ITEM_STATUS.WAITING]: [],
      [Q_ITEM_STATUS.ACTIVE]: [],
      [Q_ITEM_STATUS.COMPLETED]: [],
      [Q_ITEM_STATUS.FAILED]: [],
      [Q_ITEM_STATUS.DELAYED]: [],
    };
    this._qWorker = null;
    this._concurrency = DEFAULT_CONCURRENCY;
    this.Q_ITEM_STATUS = Q_ITEM_STATUS;
    this.Q_WORKER_EVENTS = Q_WORKER_EVENTS;
    this.Q_EVENTS = Q_EVENTS;
  }

  set concurrency(value){ this._concurrency = value}

  static instances = {};

  static getInstance(name) {
    return Queue.instances[name];;
  }

  _getNextItem = () => {
    const waitItems = this.qItemList[this.Q_ITEM_STATUS.WAITING];
    const nextItem = waitItems[0];
    this._removeItemStatusFrom(nextItem, this.Q_ITEM_STATUS.WAITING);
    return nextItem;
  };

  add = (itemBody, itemId) => {
    const newItem = createQItem(itemBody, this, itemId);
    this._setItemStatus(newItem, this.Q_ITEM_STATUS.WAITING);
    this.emit(this.Q_EVENTS.WAITING, newItem);
    setImmediate(() => this._runNextItem());
    return newItem;
  };

  _removeItemStatusFrom = (item, itemStatus) => {
    const fromList = this.qItemList[itemStatus];
    this.qItemList[itemStatus] = fromList.filter(
      (fromItem) => fromItem.itemId !== item.itemId
    );
  };

  _setItemStatus = (item, itemStatus, result) => {
    const targetList = this.qItemList[itemStatus];
    this.qItemList[itemStatus] = [...targetList, item];
    console.log(`${this.name} itemStatus:${itemStatus}`)
    item.emit(itemStatus, result);
  };

  _moveItemStatus = (item, fromStatus, toStatus, result) => {
    this._removeItemStatusFrom(item, fromStatus);
    this._setItemStatus(item, toStatus, result);
  };

  done = (item) => {
    return (error, result) => {
      if (error) {
        this._moveItemStatus(
          item,
          this.Q_ITEM_STATUS.ACTIVE,
          this.Q_ITEM_STATUS.FAILED
        );
        this.emit(this.Q_EVENTS.FAILED, item, error);
        this._runNextItem();
        return;
        // throw error;
      }
      this._moveItemStatus(
        item,
        this.Q_ITEM_STATUS.ACTIVE,
        this.Q_ITEM_STATUS.COMPLETED,
        result
      );
      this.emit(this.Q_EVENTS.COMPLETED, item, result);
      this._runNextItem();
    };
  };

  _runNextItem = () => {
    if (this._qWorker === null) return;
    console.log(
      `## ${this.name} => waiting: ${this.getWaitCount()} active: ${this.getActiveCount()} completed: ${this.getCompletedCount()} failed: ${this.getFailedCount()}`
    );
    if (this.getActive().length >= this._concurrency) return;
    const nextItem = this._getNextItem();
    if (nextItem === undefined) {
      this.emit('drained');
    } else {
      this._setItemStatus(nextItem, this.Q_ITEM_STATUS.ACTIVE);
      nextItem.on(this.Q_WORKER_EVENTS.PROGRESS, (progress) => {
        this.emit(this.Q_EVENTS.PROGRESS, nextItem, progress);
        // nextItem.emit(this.Q_ITEM_STATUS.PROGRESS, progress);
      });
      this.emit(this.Q_EVENTS.ACTIVE, nextItem, this.done(nextItem));
    }
  };

  getQItem = (itemId) =>
    Object.values(this.qItemList)
      .flat()
      .find((qItem) => qItem.itemId === itemId);

  hasQItem = (itemId) =>
    Object.values(this.qItemList)
      .flat()
      .some((qItem) => qItem.itemId === itemId);

  moveItem = (itemId, fromStatus, toStatus) => {
    const item = this.getQItem(itemId);
    this._moveItemStatus(item, fromStatus, toStatus);
  };

  removeFromQueue = (itemId) => {
    const item = this.getQItem(itemId);
    this._removeItemStatusFrom(item, this.Q_ITEM_STATUS.WAITING);
  };

  // getTasks = (status) => this.taskLists[status];

  getActive = () => this.qItemList[this.Q_ITEM_STATUS.ACTIVE];

  getWaitCount = () => this.qItemList[this.Q_ITEM_STATUS.WAITING].length;

  getActiveCount = () => this.qItemList[this.Q_ITEM_STATUS.ACTIVE].length;

  getCompletedCount = () => this.qItemList[this.Q_ITEM_STATUS.COMPLETED].length;

  getFailedCount = () => this.qItemList[this.Q_ITEM_STATUS.FAILED].length;

  // empty = () => (this.qItemList[this.Q_ITEM_STATUS.WAITING] = []);

  // getTaskLogs = (taskId) => {
  //   const task = this.gettask(taskId);
  //   if (task) return task.logs;
  // };

  _registerWorker(worker) {
    if (this._qWorker !== null) {
      return false;
    }
    this._qWorker = worker;
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
      this.on(this.Q_EVENTS.ACTIVE, this._qWorker);
      // invoke task which added before calling process()
      this._runNextItem();
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
  getQueue,
};
