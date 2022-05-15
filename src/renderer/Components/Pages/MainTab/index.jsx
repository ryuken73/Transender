/* eslint-disable promise/always-return */
import React from 'react';
import styled from 'styled-components';
import DnD from 'renderer/Components/Common/DnD';
import TabButtons from 'renderer/Components/Pages/MainTab/TabButtons';
import JobItemHeader from 'renderer/Components/Pages/MainTab/JobItemHeader';
import ScrollbarVirtual from 'renderer/Components/Common/ScrollBarVirtual';
import JobItem from 'renderer/Components/Pages/MainTab/JobItem';
import { createJob, getNextTask } from 'renderer/lib/jobUtil';
import useJobListState from 'renderer/hooks/useJobListState';
import bullConstants from 'renderer/config/bull-constants';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import {
  startMediainfoQueue,
  addQueue as addMediainfoQueue,
} from 'renderer/lib/mediaInfoQueue';

const addMethods = {
  'mediainfo': addMediainfoQueue,
}

const mediainfoHandler = result => {
  const video = result.getVideo();
  console.log(video);
}


const doneHandlers = {
  'mediainfo': mediainfoHandler
}

const { JOB_STATUS, TASK_STATUS, TASK_DEFAULT, Q_WORKER_EVENTS } = bullConstants;
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
const startNewTask = (task, job) => {
  const { taskType } = task;
  console.log(taskType);
  const addQueue = addMethods[taskType];
  const worker = addQueue(task, job);
  // worker.on(Q_WORKER_EVENTS.COMPLETED, result => console.log('##### task done!:', result.getVideo()))
  worker.on(Q_WORKER_EVENTS.COMPLETED, doneHandlers[taskType]);
  worker.on(Q_WORKER_EVENTS.FAILED, (error) =>
    console.log('##### task failed!:', error)
  );
};

const startAddedJobs = jobs => {
  jobs.forEach(job => {
    const firstTask = getNextTask(job);
    if (firstTask.autoStart) {
      startNewTask(firstTask, job);
    }
  });
};

const MainTab = (props) => {
  const { jobList, addJobsState } = useJobListState();
  const handleDrop = React.useCallback(
    (drops) => {
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
      startAddedJobs(jobs);
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
