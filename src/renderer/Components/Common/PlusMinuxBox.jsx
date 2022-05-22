import * as React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextBox from './TextBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MinuxBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`
const CustomIconButton = styled(IconButton)`
  && {
    color: grey !important;
    padding: 5px;
    background: transparent;
    opacity: 0.6;
  }
`

const PlusMinuxBox = (props) => {
  return (
    <Container>
      <TextBox text="Mediainfo"></TextBox>
      <ButtonContainer>
        <CustomIconButton size="small">
          <MinuxBoxIcon></MinuxBoxIcon>
        </CustomIconButton>
        <TextBox text="0"></TextBox>
        <CustomIconButton size="small">
          <AddBoxIcon></AddBoxIcon>
        </CustomIconButton>
      </ButtonContainer>
    </Container>
  )
}

export default React.memo(PlusMinuxBox);
