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
  }
`
const TextContainer = styled(Container)`
  && {
    width: 100%;
    opacity: 1;
    background: ${(props) => (props.checked ? colors.checked : 'transparent')};
  }
`;
const IconContainer = styled(Container)`
  margin-left: 20px;
`


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
  width: 100%;
  min-width: 400px;
`
const CustomTextBox = styled(TextBox)`
  text-align: center;
`
const CustomIconTextBox = styled(CustomTextBox)`
  font-size: 12px;
  opacity: 0.4;
`
const PaddingBox = styled.div`
  width: 10px;
`

const JobItem = () => {
  const { allChecked, toggleAllCheckedState } = useJobListState();

  return (
    <Container>
      <TextContainer>
        <CheckBox checked={allChecked} setChecked={toggleAllCheckedState}/>
        <TinyBox>
          <CustomTextBox text="순번" />
        </TinyBox>
        <MediumBox>
          <CustomTextBox text="작업상태" />
        </MediumBox>
        <BigBox>
          <CustomTextBox textAlign="left" text="파일명" />
        </BigBox>
        <SmallBox>
          <CustomTextBox text="크기" />
        </SmallBox>
        <SmallBox>
          <CustomTextBox text="상태" />
        </SmallBox>
        <SmallBox>
          <CustomTextBox text="진행율" />
        </SmallBox>
        <SmallBox>
          <CustomTextBox text="속도" />
        </SmallBox>
        <MediumBox>
          <CustomTextBox text="시간" />
        </MediumBox>
        <SmallBox>
          <CustomTextBox text="PID" />
        </SmallBox>
      </TextContainer>
      <IconContainer>
        <TinyBox>
          <CustomIconTextBox text="보류" />
        </TinyBox>
        <TinyBox>
          <CustomIconTextBox text="중단" />
        </TinyBox>
        <TinyBox>
          <CustomIconTextBox text="재시도" />
        </TinyBox>
        <TinyBox>
          <CustomIconTextBox text="삭제" />
        </TinyBox>
        <PaddingBox />
        {/* <Box width="50%" marginRight="20px" /> */}
      </IconContainer>
    </Container>
  )
};

export default React.memo(JobItem);
