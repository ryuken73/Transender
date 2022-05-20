/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckBox from 'renderer/Components/Common/CheckBox';
import TextBox from 'renderer/Components/Common/TextBox';
import Stepper from 'renderer/Components/Common/Stepper';
import StatusIcons from 'renderer/Components/Pages/MainTab/StatusIcons';
import IconButton from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useTaskInJob from 'renderer/hooks/useTaskInJob';
import bullConstants from 'renderer/config/bull-constants';
import colors from 'renderer/config/colors';
import { Pause } from '@mui/icons-material';

const { JOB_STATUS, TASK_TYPES }  = bullConstants;

const changeItemOpacity = props => {
  return props.status === 'active'
    ? 1
    : props.status === 'ready'
    ? 0.8
    : props.status === 'failed' || props.status === 'completed'
    ? 0.5
    : props.status === 'standby'
    ? 0.6
    : 0.4;
}
const Container = styled(Box)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
  }
`
const TextContainer = styled(Container)`
  && {
    width: 100%;
    opacity: ${changeItemOpacity};
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
    &:hover {
      background: ${colors.hovered};
    }
  }
`;
const IconContainer = styled(Container)`
  margin-left: 20px;
`
const TinyBox = styled(Box)`
  min-width: 40px;
  max-width: 40px;
`
const SmallBox = styled(Box)`
  min-width: 70px;
  max-width: 70px;
`
const MediumBox = styled(Box)`
  min-width: 120px;
  max-width: 120px;
`
const BigBox = styled(Box)`
  width: 100%;
  min-width: 400px;
`
const LightTextBox = styled(TextBox)`
  text-align: center;
  opacity: 1;
`
const CustomIconButton = styled(IconButton)`
  && {
    color: ${(props) => props.disabled ? 'grey !important' : 'white !important'};
    padding: 5px;
    background: ${(props) =>
      props.disabled ? 'transparent !important' : 'transparent'};
    opacity: 0.6;
  }
`

const JobItem = (props) => {
  const { job, rownum, ffmpegWorker, sendFileWorker } = props;
  const {
    jobId,
    checked,
    status,
    sourceFile,
    outFileSize = '-',
    percent = '-',
    speed = '-',
    outTime = '-',
    pid = '-',
  } = job;
  const {
    retryEnabled,
    // currentActiveTaskType,
    updateJobCheckState,
    removeJobState,
    // updateJobStatusState,
    retryFailedTask,
  } = useJobItemState(job);
  const { startTask, cancelTask, backToReady } = useTaskInJob(job);

  const { fileName = 'aaa.mp4' } = sourceFile;
  // console.log('re-render JobItem', job);

  React.useEffect(() => {
    // console.log('^^^ job changed: ',job.jobId, job.status);
    if (job.status === JOB_STATUS.STANDBY || job.status === JOB_STATUS.READY){
      console.log('&&&&& start new task:', job.status);
      startTask();
    }
  }, [job, startTask])

  const cancelCurrentTask = React.useCallback(() => {
    cancelTask({ ffmpegWorker, sendFileWorker });
  }, [cancelTask, ffmpegWorker, sendFileWorker]);

  const cancelDisabled = React.useMemo(
    () => job.status !== JOB_STATUS.ACTIVE,
    [job.status]
  );

  const cancelWaiting = React.useCallback(() => {
    backToReady(job);
  }, [job, backToReady]);

  const deleteDisabled = job.status === JOB_STATUS.ACTIVE || job.status === JOB_STATUS.WAITING;
  const pauseDisabled = job.status !== JOB_STATUS.WAITING;

  return (
    <Container>
      <TextContainer status={status}>
        <CheckBox checked={checked} setChecked={updateJobCheckState}/>
        <TinyBox>
          <LightTextBox text={rownum} />
        </TinyBox>
        <MediumBox>
          <StatusIcons tasks={job.tasks} />
        </MediumBox>
        <BigBox>
          <LightTextBox textAlign="left" text={fileName} />
        </BigBox>
        <SmallBox>
          <LightTextBox text={outFileSize} />
        </SmallBox>
        <SmallBox>
          <LightTextBox text={status} />
        </SmallBox>
        <SmallBox>
          <LightTextBox text={percent} />
        </SmallBox>
        <SmallBox>
          <LightTextBox text={speed} />
        </SmallBox>
        <MediumBox>
          <LightTextBox text={outTime} />
        </MediumBox>
        <SmallBox>
          <LightTextBox text={pid} />
        </SmallBox>
      </TextContainer>
      <IconContainer>
        <TinyBox>
          <CustomIconButton disabled={pauseDisabled} onClick={cancelWaiting}>
            <PauseIcon fontSize="small" />
          </CustomIconButton>
        </TinyBox>
        <TinyBox>
          <CustomIconButton disabled={cancelDisabled} onClick={cancelCurrentTask}>
            <ClearIcon fontSize="small" />
          </CustomIconButton>
        </TinyBox>
        <TinyBox>
          <CustomIconButton disabled={!retryEnabled} onClick={retryFailedTask}>
            <ReplayIcon fontSize="small" />
          </CustomIconButton>
        </TinyBox>
        <TinyBox>
          <CustomIconButton disabled={deleteDisabled} onClick={removeJobState}>
            <DeleteIcon fontSize="small" />
          </CustomIconButton>
        </TinyBox>
      </IconContainer>
      {/* <Box width="50%" marginRight="20px">
        <Stepper />
      </Box> */}
    </Container>
  )
};

export default React.memo(JobItem);
