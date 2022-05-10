import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonIcon from 'renderer/Components/Common/ButtonIcon';
import useJobListState from 'renderer/hooks/useJobListState';

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: ${(prop) => prop.height || 'auto'};
  width: ${(prop) => prop.height || 'auto'};
  .MuiSvgIcon-root {
    color: ${(props) => props.color || 'white'};
    opacity: ${(props) => props.opacitynormal || '0.7'};
  }
`;

const TabButtons = () => {
  const { removeJobAllCheckedState } = useJobListState();
  return (
    <ButtonIcon
      text="삭제"
      iconComponent={<DeleteIcon />}
      border="1px solid rgba(255, 255, 255, .5)"
      hoverBorder="1px solid rgba(255, 255, 255, 0.8)"
      onClick={removeJobAllCheckedState}
    />
  );
};

export default React.memo(TabButtons);
