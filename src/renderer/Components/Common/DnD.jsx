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
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  /* border: 1px white dashed; */
  border: grey 1px ${(props) => (props.isDragAccept ? 'dashed' : 'solid')};
  font-size: 12px;
  color: white;
  width: 100%;
  flex: 1;
  border-color: ${(props) => getColor(props)};
  background: ${(props) => (props.isDragAccept ? '#343858' : 'transparent')};
  color: #bdbdbd;
  outline: none;
  transition: all 0.24s ease-in-out;
  overflow-y: auto;
`;

const DnD = (props) => {
  const { onDrop, message = 'Drop Files or Folder' } = props;
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

  return (
    <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      <Box sx={{ padding: '0px' }}>{message}</Box>
      {props.children}
    </Container>
  );
};

export default React.memo(DnD);
