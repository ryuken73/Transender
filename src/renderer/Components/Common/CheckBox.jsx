/* eslint-disable react/prop-types */
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import colors from 'renderer/config/colors';

const SmallCheckBox = (props) => {
  const { checked, setChecked, handleClick = () => {} } = props;
  const handleChange = React.useCallback(
    (event) => {
      setChecked(event.target.checked, event);
    },
    [setChecked]
  );
  return (
    <div>
      <Checkbox
        {...props}
        checked={checked}
        onChange={handleChange}
        onClick={handleClick}
        sx={{
          color: colors.textSub,
          '&.Mui-checked': {
            color: 'white',
            opacity: 0.5,
          },
          '& .MuiSvgIcon-root': { fontSize: 15 },
        }}
      />
    </div>
  );
};

export default React.memo(SmallCheckBox);
