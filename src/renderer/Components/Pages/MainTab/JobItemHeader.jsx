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
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    width: 100%;
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
  }
`;
const TinyBox = styled(Box)`
  min-width: 40px;
  max-width: 40px;
`
const SmallBox = styled(Box)`
  min-width: 70px;
  max-width: 70px;
`
const MediumBox = styled(Box)`
  min-width: 120px;
  max-width: 120px;
`
const BigBox = styled(Box)`
  width: 100%
  min-width: 400px;
`
const CustomTextBox = styled(TextBox)`
  text-align: center ;
`

const JobItem = () => {
  const { allChecked, toggleAllCheckedState } = useJobListState();

  return (
    <Container>
      <CheckBox checked={allChecked} setChecked={toggleAllCheckedState}/>
      <TinyBox width="3%">
        <CustomTextBox text="순번" />
      </TinyBox>
      <BigBox flex="2">
        <CustomTextBox text="파일명" />
      </BigBox>
      <SmallBox width="10%">
        <CustomTextBox text="크기" />
      </SmallBox>
      <SmallBox width="10%">
        <CustomTextBox text="상태" />
      </SmallBox>
      <SmallBox width="10%">
        <CustomTextBox text="진행율" />
      </SmallBox>
      <SmallBox width="10%">
        <CustomTextBox text="속도" />
      </SmallBox>
      <MediumBox>
        <CustomTextBox text="시간" />
      </MediumBox>
      <SmallBox width="10%">
        <CustomTextBox text="PID" />
      </SmallBox>
      {/* <Box width="50%" marginRight="20px" /> */}
    </Container>
  )
};

export default React.memo(JobItem);
