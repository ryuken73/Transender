/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckBox from 'renderer/Components/Common/CheckBox';
import TextBox from 'renderer/Components/Common/TextBox';
import useJobListState from 'renderer/hooks/useJobListState';
import colors from 'renderer/config/colors';

const Container = styled(Box)`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 40px;
    width: 100%;
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
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

const JobItem = () => {
  const { allChecked, toggleAllCheckedState } = useJobListState();

  return (
    <Container>
      <CheckBox checked={allChecked} setChecked={toggleAllCheckedState}/>
      <TinyBox width="3%">
        <TextBox text="순번" />
      </TinyBox>
      <BigBox flex="2">
        <TextBox text="파일명" />
      </BigBox>
      <SmallBox width="10%">
        <TextBox text="크기" />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text="상태" />
      </SmallBox>
      <SmallBox width="10%">
        <TextBox text="PID" />
      </SmallBox>
      <Box width="50%" marginRight="20px" />
    </Container>
  )
};

export default React.memo(JobItem);
