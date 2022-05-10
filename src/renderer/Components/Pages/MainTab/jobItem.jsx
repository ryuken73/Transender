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
      <TinyBox width="3%">
        <TextBox text={rownum} />
      </TinyBox>
      <BigBox flex="2">
        <TextBox text={fileName} />
      </BigBox>
      <SmallBox width="10%">
        <TextBox text={size} />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text={status} />
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

export default React.memo(jobItem);
