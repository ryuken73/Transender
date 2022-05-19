/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react'
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import SecurityIcon from '@mui/icons-material/Security';
import IosShareIcon from '@mui/icons-material/IosShare';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import bullConstannts from 'renderer/config/bull-constants';

const { TASK_TYPES, Q_ITEM_STATUS } = bullConstannts;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CustomIconButton = styled(IconButton)`
  && {
    color: white;
    /* color: ${(props) => (props.running ? 'greenyellow' : 'white')}; */
    padding: 1px;
    cursor: auto;
    opacity: ${(props) =>
      props.running ? 1 : props.failure || props.success ? 0.8 : 0.4};
  }
`
const WithDoneIconButton = React.memo((props) => {
  const { status, children } = props;
  const success = status === Q_ITEM_STATUS.COMPLETED;
  const failure = status === Q_ITEM_STATUS.FAILED;
  const running = status === Q_ITEM_STATUS.ACTIVE;
  console.log('^^^',status, success)
  return (
    <CustomIconButton
      running={running}
      success={success}
      failure={failure}
      size="small"
    >
      {success ? (
        <CheckIcon fontSize="inherit" />
      ) : failure ? (
        <CloseIcon fontSize="inherit" />
      ) : (
        children
      )}
    </CustomIconButton>
  )
});

const StatusIcons = (props) => {
  const { tasks = [] } = props;
  const taskStatus = React.useMemo(() => {
    return tasks.reduce((acct, task) => {
      const taskObj = {
        ...acct,
        [task.taskType]: task.status,
      };
      return taskObj;
    }, {});
  }, [tasks]);

  console.log('^^^',taskStatus)
  return (
    <Container>
      <WithDoneIconButton status={taskStatus[TASK_TYPES.MEDIAINFO]}>
        <InfoIcon fontSize="inherit" />
      </WithDoneIconButton>
      <WithDoneIconButton status={taskStatus[TASK_TYPES.TRANSCODE]}>
        <VideoFileIcon fontSize="inherit" />
      </WithDoneIconButton>
      <WithDoneIconButton status={taskStatus[TASK_TYPES.VIRUS_SCAN]}>
        <SecurityIcon fontSize="inherit" />
      </WithDoneIconButton>
      <WithDoneIconButton status={taskStatus[TASK_TYPES.SEND_FILE]}>
        <IosShareIcon fontSize="inherit" />
      </WithDoneIconButton>
    </Container>
  )
}

export default React.memo(StatusIcons);
