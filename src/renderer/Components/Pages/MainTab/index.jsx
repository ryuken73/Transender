/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/named */
/* eslint-disable promise/always-return */
import React from 'react';
import styled from 'styled-components';
import DnD from 'renderer/Components/Common/DnD';
import TabButtons from 'renderer/Components/Pages/MainTab/TabButtons';
import JobItemHeader from 'renderer/Components/Pages/MainTab/JobItemHeader';
import ScrollbarVirtual from 'renderer/Components/Common/ScrollBarVirtual';
import JobItem from 'renderer/Components/Pages/MainTab/JobItem';
import { createJob, getNextStandbyTask } from 'renderer/lib/jobUtil';
import useJobListState from 'renderer/hooks/useJobListState';
import bullConstants from 'renderer/config/bull-constants';
// import mediaInfoProc from 'renderer/lib/mediaInfoProc';
// import {
  // startMediainfoQueue,
  // addQueue as addMediainfoQueue,
// } from 'renderer/lib/mediaInfoQueue';


// const makeFFmpegOptions = (video, audio) => {
//   return '-y -acodec copy -progress pipe:1';
// }
// const makeFFmpegOutPath = () => {
//   return 'd:/temp/aaa.mp4';
// }

// const mediainfoHandler = result => {
//   const { rawResult, video, audio } = result;
//   console.log('&&&&', video('Count'));
//   const ffmpegOptions = makeFFmpegOptions(video, audio);
//   const totalFrames = video('Count')[0];
//   const outFile = makeFFmpegOutPath();
// }



// const { JOB_STATUS, TASK_STATUS, TASK_DEFAULT, Q_WORKER_EVENTS } = bullConstants;
const { DEFAULT_TASK_FLOW } = bullConstants;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  height: 30px;
  width: 100%;
`

const MainTab = (props) => {
  const { jobList, addJobsState } = useJobListState();
  // const addMethods = {
  //   mediainfo: addMediainfoItem,
  // };
  const handleDrop = React.useCallback(
    (drops) => {
      // const startTask = (task, job) => {
      //   const { taskType } = task;
      //   const addQueue = addMethods[taskType];
      //   console.log('~~~~', addQueue)
      //   addQueue(task, job);
      // };

      // const startAddedJobs = (jobs) => {
      //   jobs.forEach((job) => {
      //     const task = getNextTask(job);
      //     if (task.autoStart) {
      //       startTask(task, job);
      //     }
      //   });
      // };

      const jobs = drops.map((drop) => {
        const { name, path, size } = drop;
        return createJob({
          taskFlow: DEFAULT_TASK_FLOW,
          sourceFile: {
            fileName: name,
            fullName: path,
            fileSize: size,
          },
        });
      });
      addJobsState(jobs);
      // startAddedJobs(jobs);
    },
    [addJobsState]
  );
  return (
    <Container>
      <TabButtons />
      <JobItemHeader />
      <DnD onDrop={handleDrop} showPlaceholder={jobList.length === 0}>
        {/* <ScrollbarVirtual
          items={jobList}
          rowHeight={57}
          heightMinus="200px"
          ItemElement={JobItem}
         /> */}
        {jobList.map((job, index) => (
          <JobItem job={job} key={job.jobId} rownum={index+1} />
        ))}
      </DnD>
    </Container>
  );
};

export default React.memo(MainTab);
