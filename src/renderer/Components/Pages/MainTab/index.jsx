/* eslint-disable promise/always-return */
import React from 'react';
import DnD from 'renderer/Components/Common/DnD';
import jobItem from './jobItem';
import createJob from 'renderer/lib/jobUtil';
import useJobState from 'renderer/hooks/useJobState';
import constants from 'renderer/config/bull-constants';
import mediaInfoProc from 'renderer/lib/mediaInfoProc';
import { getAbsolutePath } from 'renderer/lib/electronUtil';
import JobItem from './jobItem';

const mediainfoBinary = getAbsolutePath('src/bin/Mediainfo.exe');
const mediaInfo = mediaInfoProc(mediainfoBinary);

const { DEFAULT_TASK_FLOW } = constants;

const MainTab = (props) => {
  const { jobList, addJobState } = useJobState();
  const handleDrop = React.useCallback(
    (drops) => {
      drops.forEach(async (drop) => {
        const { name, path, size } = drop;
        await mediaInfo.run(path);
        const Video = mediaInfo.getStreams('Video');
        const job =  createJob({
          taskFlow: DEFAULT_TASK_FLOW,
          args: {
            fileName: name,
            fullName: path,
            fileSize: size,
            duration: Video('Duration'),
          },
        });
        addJobState([job]);
      });
    //   Promise.all(jobs)
    //     .then((results) => {
    //       addJobState(results);
    //     })
    //     .catch((error) => {
    //       throw new Error(error);
    //     });
    },
    [addJobState]
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
