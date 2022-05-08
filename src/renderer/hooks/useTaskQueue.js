import React from 'react';
import createQueue from 'renderer/lib/queueClass';

function useTaskQueue(queueName, constants) {
  const taskQueue = createQueue(queueName, constants);
  return taskQueue;
}

export default useTaskQueue;
