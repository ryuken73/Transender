import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonIcon from 'renderer/Components/Common/ButtonIcon';
import useJobListState from 'renderer/hooks/useJobListState';

const Container = styled.div`
  display: flex;
`
const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: ${(prop) => prop.height || 'auto'};
  width: ${(prop) => prop.height || 'auto'};
  .MuiSvgIcon-root {
    color: ${(props) => props.color || 'white'};
    opacity: ${(props) => props.opacitynormal || '0.7'};
  }
`;

const TabButtons = () => {
  const { removeJobAllCheckedState, setAllManualStartState } = useJobListState();
  return (
    <ButtonContainer>
      <ButtonIcon
        text="작업시작"
        iconComponent={<PlayCircleIcon />}
        border="1px solid rgba(255, 255, 255, .5)"
        hoverBorder="1px solid rgba(255, 255, 255, 0.8)"
        onClick={setAllManualStartState}
      />
      <ButtonIcon
        text="삭제"
        iconComponent={<DeleteIcon />}
        border="1px solid rgba(255, 255, 255, .5)"
        hoverBorder="1px solid rgba(255, 255, 255, 0.8)"
        onClick={removeJobAllCheckedState}
      />
    </ButtonContainer>

  );
};

export default React.memo(TabButtons);
