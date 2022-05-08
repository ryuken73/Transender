import React from 'react';
import DnD from 'renderer/Components/Common/DnD';
import createJob from 'renderer/lib/jobUtil';
import useJobState from 'renderer/hooks/useJobState';
import constants from 'renderer/config/bull-constants';

const { DEFAULT_TASK_FLOW } = constants;

const MainTab = props => {
  const { jobList, addJobState } = useJobState();
  const handleDrop = React.useCallback((drops) => {
    const jobs = drops.map(drop => {
      const {name, path, size} = drop;
      return createJob({
       taskFlow: DEFAULT_TASK_FLOW,
       args: {
         fileName: name,
         fullName: path,
         fileSize: size
       }
      })
    })
    addJobState(jobs);``
  }, [addJobState]);
  console.log('$$$$', jobList)
  return (
    <DnD onDrop={handleDrop}>
      {jobList.map(job => (
        <div>{job.args.fileName}</div>
      ))}
    </DnD>
  )
}

export default React.memo(MainTab);
