/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return 'grey';
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.showPlaceholder && 'center'};
  align-items: center;
  /* border-radius: 5px; */
  border: grey 1px ${(props) => (props.isDragAccept ? 'dashed' : 'none')};
  font-size: calc(10px + 1.3vmin);
  color: white;
  width: 100%;
  border-color: ${(props) => getColor(props)};
  background: ${(props) => (props.isDragAccept ? '#343858' : 'transparent')};
  color: #bdbdbd;
  outline: none;
  transition: all 0.24s ease-in-out;
  overflow-y: auto;
  height: 100%;
`;
const HolderContainer = styled.div`
  display: ${(props) => props.show ? 'block':'none'};
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
`

const DnD = (props) => {
  const { onDrop, showPlaceholder = true, message = 'Drop Files or Folder' } = props;
  const dropZoneOptions = {
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone(dropZoneOptions);

  const rootPropsMemo = React.useMemo(
    () => getRootProps({ isFocused, isDragAccept, isDragReject }),
    [getRootProps, isDragAccept, isDragReject, isFocused]
  );

  const PlaceHolder = (props) => {
    const { show, message } = props;
    return (
      <HolderContainer show={show}>
        <Box>{message}</Box>
      </HolderContainer>
    )
  }

  const inputPropsMemo = React.useMemo(() => getInputProps(), [getInputProps]);

  return (
    <Container showPlaceholder={showPlaceholder} {...rootPropsMemo}>
      <input {...inputPropsMemo} />
      {/* {props.showPlaceholder && <PlaceHolder message={message}></PlaceHolder>} */}
      {props.children}
      <PlaceHolder show={showPlaceholder} message={message} />
    </Container>
  );
};

export default React.memo(DnD);
