/* eslint-disable promise/always-return */
import React from 'react';
import DnD from 'renderer/Components/Common/DnD';
import JobItem from 'renderer/Components/Pages/MainTab/jobItem';
import createJob from 'renderer/lib/jobUtil';
import useJobListState from 'renderer/hooks/useJobListState';
import constants from 'renderer/config/bull-constants';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import { getAbsolutePath } from 'renderer/lib/electronUtil';

const { JOB_STATUS, TASK_STATUS, TASK_DEFAULT } = constants;
const { DEFAULT_TASK_FLOW } = constants;

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
    // <Container>
    <DnD onDrop={handleDrop} showPlaceholder={jobList.length === 0}>
      {jobList.map((job, index) => (
        <JobItem job={job} key={job.jobId} rownum={index+1} />
      ))}
    </DnD>
    // </Container>
  );
};

export default React.memo(MainTab);
