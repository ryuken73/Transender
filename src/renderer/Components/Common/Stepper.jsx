/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Box from '@mui/material/Box';
import 'react-step-progress-bar/styles.css';
import { ProgressBar, Step } from 'react-step-progress-bar';

const steps = ['Transcode', 'Virus Check', 'Send File'];

export default function Stepper() {
  return (
    <ProgressBar percent={38}>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{ color: `${accomplished ? 'white':'black'}`}}
          >V</div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{ color: `${accomplished ? 'white':'black' }` }}
          >V</div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{ color: `${accomplished ? 'white':'black' }` }}
          >V</div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{ color: `${accomplished ? 'white':'grey' }` }}
          >D</div>
        )}
      </Step>
    </ProgressBar>
  );
}
