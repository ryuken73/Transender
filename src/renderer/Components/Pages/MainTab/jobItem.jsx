/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckBox from 'renderer/Components/Common/CheckBox';
import TextBox from 'renderer/Components/Common/TextBox';
import Stepper from 'renderer/Components/Common/Stepper';
import StatusIcons from 'renderer/Components/Pages/MainTab/StatusIcons';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useMediainfoQueue from 'renderer/hooks/useMediainfoQueue';
import useFFmpegQueue from 'renderer/hooks/useFFmpegQueue';
import useVirusScanQueue from 'renderer/hooks/useVirusScanQueue';
import { getNextStandbyTask } from 'renderer/lib/jobUtil';
import bullConstants from 'renderer/config/bull-constants';
import colors from 'renderer/config/colors';

const { JOB_STATUS }  = bullConstants;

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

const JobItem = (props) => {
  const { job, rownum } = props;
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
  const { updateJobCheckState, updateJobStatusState } = useJobItemState(jobId);
  const { addMediainfoItem } = useMediainfoQueue(jobId);
  const { addFFmpegItem } = useFFmpegQueue(jobId);
  const { addVirusScanItem } = useVirusScanQueue(jobId);
  const { fileName = 'aaa.mp4' } = sourceFile;
  console.log('re-render JobItem', job)
  const addVirusScan = React.useCallback(() => {},[]);
  const addSendFile = React.useCallback(() => {},[]);
  const addMethods = React.useMemo(() => {
    return {
      mediainfo: addMediainfoItem,
      transcode: addFFmpegItem,
      virusScan: addVirusScanItem,
      sendFile: addSendFile,
    };
  }, [addFFmpegItem, addMediainfoItem, addVirusScan, addSendFile])
  const startStandbyTask = React.useCallback((task, job) => {
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
      if (task.autoStart || (job.manualStarted && job.checked)){
        console.log('~~~~ startStandbyTask', task)
        startStandbyTask(task, job);
      }
    },
    [startStandbyTask]
  );
  React.useEffect(() => {
    console.log('^^^ job changed: ',job.jobId, job.status);
    if (job.status === JOB_STATUS.STANDBY || job.status === JOB_STATUS.READY){
      console.log('&&&&& start start new task:', job.status);
      startTask(job);
    }
  }, [job, startTask])

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
      {/* <Box width="50%" marginRight="20px">
        <Stepper />
      </Box> */}
    </Container>
  )
};

export default React.memo(JobItem);
