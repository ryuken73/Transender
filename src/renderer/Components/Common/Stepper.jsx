/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Box from '@mui/material/Box';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import SecurityIcon from '@mui/icons-material/Security';
import IosShareIcon from '@mui/icons-material/IosShare';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import 'react-step-progress-bar/styles.css';
import { ProgressBar, Step } from 'react-step-progress-bar';

const steps = ['Transcode', 'Virus Check', 'Send File'];

export default function Stepper() {
  return (
    <ProgressBar percent={0}>
      <Step transition="scale">
        {({ accomplished }) => (
          <VideoFileIcon></VideoFileIcon>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <SecurityIcon></SecurityIcon>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <IosShareIcon></IosShareIcon>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <CheckCircleIcon></CheckCircleIcon>
        )}
      </Step>
    </ProgressBar>
  );
}
