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
import CancelIcon from '@mui/icons-material/Cancel';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useMediainfoAdd from 'renderer/hooks/useMediainfoAdd';
import useFFmpegAdd from 'renderer/hooks/useFFmpegAdd';
import useVirusScanAdd from 'renderer/hooks/useVirusScanAdd';
import useSendFileAdd from 'renderer/hooks/useSendFileAdd';
import { getNextStandbyTask } from 'renderer/lib/jobUtil';
import bullConstants from 'renderer/config/bull-constants';
import colors from 'renderer/config/colors';

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
    width: 100%;
    opacity: ${changeItemOpacity};
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
    &:hover {
      background: ${colors.hovered};
    }
  }
`;
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
    currentActiveTaskType,
    updateJobCheckState,
    removeJobState,
    updateJobStatusState,
    retryFailedTask,
  } = useJobItemState(job);
  const { addMediainfoItem } = useMediainfoAdd(job);
  const { addFFmpegItem } = useFFmpegAdd(job);
  const { addVirusScanItem } = useVirusScanAdd(job);
  const { addSendFileItem } = useSendFileAdd(job);
  const { fileName = 'aaa.mp4' } = sourceFile;
  console.log('re-render JobItem', job);
  const addMethods = React.useMemo(() => {
    return {
      mediainfo: addMediainfoItem,
      transcode: addFFmpegItem,
      virusScan: addVirusScanItem,
      sendFile: addSendFileItem,
    };
  }, [addMediainfoItem, addFFmpegItem, addVirusScanItem, addSendFileItem])
  const startStandbyTask = React.useCallback((task, job) => {
      console.log('*** in startStandybTask');
      const { taskType } = task;
      const addQueue = addMethods[taskType];
      updateJobStatusState(JOB_STATUS.WAITING);
      console.log('~~~~ add new task', task)
      addQueue(task, job);
    },
    [addMethods, updateJobStatusState]
  );
  const startTask = React.useCallback((job) => {
    // prevous task should not be in standby state
    console.log('*** tasks in job state:', job)
      const task = getNextStandbyTask(job);
      if ( task === undefined ) return;
      if (task.autoStart || (job.manualStarted && job.checked)){
        console.log('~~~~ startStandbyTask', task)
        startStandbyTask(task, job);
      }
    },
    [startStandbyTask]
  );
  React.useEffect(() => {
    // console.log('^^^ job changed: ',job.jobId, job.status);
    if (job.status === JOB_STATUS.STANDBY || job.status === JOB_STATUS.READY){
      console.log('&&&&& start start new task:', job.status);
      startTask(job);
    }
  }, [job, startTask])

  const cancelTask = React.useCallback(() => {
    console.log('#### cancelTask', currentActiveTaskType, ffmpegWorker, sendFileWorker);
    currentActiveTaskType === TASK_TYPES.TRANSCODE && ffmpegWorker.stop();
    currentActiveTaskType === TASK_TYPES.SEND_FILE && sendFileWorker.stop();
  }, [currentActiveTaskType, ffmpegWorker, sendFileWorker]);

  const cancelDisabled = React.useMemo(
    () => job.status !== JOB_STATUS.ACTIVE,
    [job.status]
  );

  const deleteDisabled = job.status === JOB_STATUS.ACTIVE;

  return (
    <Container status={status}>
      <CheckBox checked={checked} setChecked={updateJobCheckState}/>
      <TinyBox width="3%">
        <LightTextBox text={rownum} />
      </TinyBox>
      <MediumBox>
        <StatusIcons tasks={job.tasks} />
      </MediumBox>
      <BigBox>
        <LightTextBox textAlign="left" text={fileName} />
      </BigBox>
      <SmallBox width="10%">
        <LightTextBox text={outFileSize} />
      </SmallBox>
      <SmallBox width="10%">
        <LightTextBox text={status} />
      </SmallBox>
      <SmallBox width="10%">
        <LightTextBox text={percent} />
      </SmallBox>
      <SmallBox width="10%">
        <LightTextBox text={speed} />
      </SmallBox>
      <MediumBox>
        <LightTextBox text={outTime} />
      </MediumBox>
      <SmallBox width="10%">
        <LightTextBox text={pid} />
      </SmallBox>
      <TinyBox width="10%">
        <CustomIconButton disabled={!retryEnabled} onClick={retryFailedTask}>
          <ReplayIcon fontSize="small" />
        </CustomIconButton>
      </TinyBox>
      <TinyBox width="10%">
        <CustomIconButton disabled={cancelDisabled} onClick={cancelTask}>
          <ClearIcon fontSize="small" />
        </CustomIconButton>
      </TinyBox>
      <TinyBox width="10%">
        <CustomIconButton disabled={deleteDisabled} onClick={removeJobState}>
          <DeleteIcon fontSize="small" />
        </CustomIconButton>
      </TinyBox>
      {/* <Box width="50%" marginRight="20px">
        <Stepper />
      </Box> */}
    </Container>
  )
};

export default React.memo(JobItem);
