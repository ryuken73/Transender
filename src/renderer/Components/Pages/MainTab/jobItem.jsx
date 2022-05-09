import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckBox from 'renderer/Components/Common/CheckBox';
import TextBox from 'renderer/Components/Common/TextBox';
import Stepper from 'renderer/Components/Common/Stepper';
import colors from 'renderer/config/colors';

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

const jobItem = (props) => {
  const { job, rownum } = props;
  const { status, args } = job;
  const {
    fileName = 'aaa.mp4',
    size = '100MB',
    pid = '0',
    checked = false,
  } = args;

  return (
    <Container>
      <CheckBox checked={checked} />
      <Box width="3%">
        <TextBox text={rownum} />
      </Box>
      <Box flex="2" maxWidth="500px" minWidth="500px">
        <TextBox text={fileName} />
      </Box>
      <Box width="10%">
        <TextBox text={size} />
      </Box>
      <Box width="10%">
        <TextBox text={status} />
      </Box>
      <Box width="10%">
        <TextBox text={pid} />
      </Box>
      <Box width="50%" marginRight="10px">
        <Stepper />
      </Box>
    </Container>
  )
};

export default React.memo(jobItem);
