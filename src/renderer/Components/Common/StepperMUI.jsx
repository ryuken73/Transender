import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const CustomStepper = styled(Stepper)`
`

const steps = [
  'Transcode',
  'Virus Check',
  'Send File',
];

export default function Stepper() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={0}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
