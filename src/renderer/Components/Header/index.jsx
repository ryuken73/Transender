/* eslint-disable promise/always-return */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import TextBox from 'renderer/Components/Common/TextBox';
import { createQueue } from 'renderer/lib/queueClass';
import constants from 'renderer/config/constants';
import bullConstants from 'renderer/config/bull-constants';
import defaultConfig from 'renderer/config/defaultConfig';
import useInitConfig from 'renderer/hooks/useInitConfig';
import useConfig from 'renderer/hooks/useConfig';
import ButtonIcon from 'renderer/Components/Common/ButtonIcon';
import FolderIcon from '@mui/icons-material/Folder';
import PlusMinuxBox from '../Common/PlusMinuxBox';

const { ipcRenderer } = require('electron');
const Store = require('electron-store');

const { DEFAULT_CUSTOM_CONFIG_NAME } = constants;
const { TASK_TYPES } = bullConstants;
const customConfigStore = new Store({ name: DEFAULT_CUSTOM_CONFIG_NAME });

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`
const QStatusBox = styled.div`
  margin-left: 10px;
  margin-right: auto;
`
const InfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  margin-right: 10px;
`
const CustomTextBox = styled(TextBox)`
  font-size: 12px;
  margin: 5px;
`

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
    <Container>
      <QStatusBox>
        <CustomTextBox text="동시 작업수">mediainfo</CustomTextBox>
        <PlusMinuxBox></PlusMinuxBox>
      </QStatusBox>
      <InfoBox>
        <Box marginRight="5px">
          <TextBox fontSize="11px" text={"출력폴더:"}></TextBox>
        </Box>
        <Box maxWidth="300px" marginRight="0px">
          <TextBox fontSize="10px" text={config.FFMPEG_TARGET_DIR}></TextBox>
        </Box>
        <ButtonIcon iconComponent={<FolderIcon />} text="change" onClick={changePath}></ButtonIcon>
      </InfoBox>
    </Container>
  );
};

export default React.memo(Header);
