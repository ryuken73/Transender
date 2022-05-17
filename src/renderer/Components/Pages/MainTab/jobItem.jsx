/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckBox from 'renderer/Components/Common/CheckBox';
import TextBox from 'renderer/Components/Common/TextBox';
import Stepper from 'renderer/Components/Common/Stepper';
import useJobItemState from 'renderer/hooks/useJobItemState';
import useMediainfoQueue from 'renderer/hooks/useMediainfoQueue';
import useFFmpegQueue from 'renderer/hooks/useFFmpegQueue';
import { getNextStandbyTask } from 'renderer/lib/jobUtil';
import bullConstants from 'renderer/config/bull-constants';
import colors from 'renderer/config/colors';

const { JOB_STATUS }  = bullConstants;

const Container = styled(Box)`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 40px;
    width: 100%;
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
    &:hover {
      background: ${colors.hovered};
    }
  }
`;
const TinyBox = styled(Box)`
  min-width: 40px;
`
const SmallBox = styled(Box)`
  min-width: 70px;
`
const BigBox = styled(Box)`
  min-width: 400px;
  max-width: 400px;
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
    pid = '-',
  } = job;
  const { updateJobCheckState, updateJobStatusState } = useJobItemState(jobId);
  const { addMediainfoItem } = useMediainfoQueue(jobId);
  const { addFFmpegItem } = useFFmpegQueue(jobId);
  const { fileName = 'aaa.mp4' } = sourceFile;
  console.log('re-render JobItem', job)
  const addVirusScan = () => {};
  const addSendFile = () => {};
  const addMethods = React.useMemo(() => {
    return {
      mediainfo: addMediainfoItem,
      transcode: addFFmpegItem,
      virusScan: addVirusScan,
      sendFile: addSendFile,
    };
  }, [addFFmpegItem, addMediainfoItem])
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
    <Container>
      <CheckBox checked={checked} setChecked={updateJobCheckState}/>
      <TinyBox width="3%">
        <TextBox text={rownum} />
      </TinyBox>
      <BigBox flex="2">
        <TextBox text={fileName} />
      </BigBox>
      <SmallBox width="10%">
        <TextBox text={outFileSize} />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text={status} />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text={percent} />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text={pid} />
      </SmallBox>
      <Box width="50%" marginRight="20px">
        <Stepper />
      </Box>
    </Container>
  )
};

export default React.memo(JobItem);
