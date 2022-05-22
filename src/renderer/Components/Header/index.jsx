/* eslint-disable promise/always-return */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import BasicCard from 'renderer/Components/Common/BasicCard';
import { createQueue } from 'renderer/lib/queueClass';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import defaultConfig from 'renderer/config/defaultConfig';
import useInitConfig from 'renderer/hooks/useInitConfig';
import useConfig from 'renderer/hooks/useConfig';

const { ipcRenderer } = require('electron');
const Store = require('electron-store');

const { DEFAULT_CUSTOM_CONFIG_NAME } = constants;
const { TASK_TYPES } = bullConstants;
const customConfigStore = new Store({ name: DEFAULT_CUSTOM_CONFIG_NAME });

const Header = () => {
  const [queues, setQueues] = React.useState({});
  const { syncConfigStateWithStore } = useInitConfig();
  const { config, updateConfigState } = useConfig(customConfigStore);
  React.useEffect(() => {
    Object.keys(TASK_TYPES).forEach((key) => {
      const queue = createQueue(TASK_TYPES[key], bullConstants);
      setQueues((queues) => {
        return {
          ...queues,
          [queue.name]: queue,
        };
      });
    });
  }, []);
  React.useEffect(() => {
    syncConfigStateWithStore(defaultConfig, customConfigStore);
  }, []);
  const changePath = React.useCallback(() => {
    ipcRenderer
      .invoke('changeDirectory')
      .then((path) => {
        console.log('selected:', path);
        updateConfigState({ key: 'FFMPEG_TARGET_DIR', value: path });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [updateConfigState]);
  return (
    <div>
      <div>${config.FFMPEG_TARGET_DIR}</div>
      <button onClick={changePath}>change</button>
    </div>
  );
};

export default React.memo(Header);
