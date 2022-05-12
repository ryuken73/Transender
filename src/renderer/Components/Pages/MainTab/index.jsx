/* eslint-disable promise/always-return */
import React from 'react';
import styled from 'styled-components';
import DnD from 'renderer/Components/Common/DnD';
import TabButtons from 'renderer/Components/Pages/MainTab/TabButtons';
import JobItemHeader from 'renderer/Components/Pages/MainTab/JobItemHeader';
import ScrollbarVirtual from 'renderer/Components/Common/ScrollBarVirtual';
import JobItem from 'renderer/Components/Pages/MainTab/JobItem';
import createJob from 'renderer/lib/jobUtil';
import useJobListState from 'renderer/hooks/useJobListState';
import constants from 'renderer/config/bull-constants';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import { getAbsolutePath } from 'renderer/lib/electronUtil';

const { JOB_STATUS, TASK_STATUS, TASK_DEFAULT } = constants;
const { DEFAULT_TASK_FLOW } = constants;

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
  const handleDrop = React.useCallback(
    (drops) => {
      const jobs = drops.map((drop) => {
        const { name, path, size } = drop;
        return createJob({
          taskFlow: DEFAULT_TASK_FLOW,
          args: {
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
  console.log('$$$$', jobList);
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
