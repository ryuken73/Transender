/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import useTaskQueue from 'renderer/hooks/useTaskQueue';
import constants from 'renderer/config/bull-constants';

const { TASK_TYPES } = constants;

const Header = () => {
  const [queues, setQueues] = React.useState({});
  React.useEffect(() => {
    Object.keys(TASK_TYPES).forEach((key) => {
      const queue = useTaskQueue(TASK_TYPES[key], constants);
      setQueues((queues) => {
        return {
          ...queues,
          [queue.name]: queue
        }
      })
    });
  }, []);
  return (
    <div>
      {Object.keys(queues).map(key => (
        <div>{queues[key].name}</div>
      ))}
    </div>
  )
};

export default React.memo(Header);
