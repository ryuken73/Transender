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
import { createJob } from 'renderer/lib/jobUtil';
import useJobListState from 'renderer/hooks/useJobListState';
import useMediainfoStart from 'renderer/hooks/useMediainfoStart';
import useFFmpegStart from 'renderer/hooks/useFFmpegStart';
import useVirusScanStart from 'renderer/hooks/useVirusScanStart';
import useSendFileStart from 'renderer/hooks/useSendFileStart';
import bullConstants from 'renderer/config/bull-constants';

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

const MainTab = () => {
  const { jobList, addJobsState } = useJobListState();
  const { startMediainfoQueue } = useMediainfoStart();
  const { startFFmpegQueue, workers: ffmpegWorkers } = useFFmpegStart();
  const { startVirusScanQueue } = useVirusScanStart();
  const { startSendFileQueue, workers: sendFileWorkers } = useSendFileStart();
  console.log('### re-render MainTab');
  // console.log('### ffmpegWorkers:', ffmpegWorkers);
  // console.log('### sendFileWorkers:', sendFileWorkers);
  React.useEffect(() => {
    console.log('%%%%% called useJobListState');
    let queue;
    try {
      startMediainfoQueue();
      startFFmpegQueue();
      startVirusScanQueue();
      startSendFileQueue();
    } catch (err) {
      console.error(err);
    }
    return () => {
      console.log('remove event listener', queue);
      if (queue) {
        // remove EventListener of mediaInfo
      }
    };
  }, []);
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
          <JobItem
            job={job}
            key={job.jobId}
            rownum={index + 1}
            ffmpegWorker={ffmpegWorkers[job.jobId]}
            sendFileWorker={sendFileWorkers[job.jobId]}
          />
        ))}
      </DnD>
    </Container>
  );
};

export default React.memo(MainTab);
