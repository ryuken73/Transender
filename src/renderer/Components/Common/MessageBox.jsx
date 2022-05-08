import React from 'react';
import SnackBar from 'renderer/Components/Common/SnackBar';
import TextBox from 'renderer/Components/Common/TextBox';
import { useSelector } from 'react-redux';
import colors from 'renderer/config/colors';

const MessageBox = () => {
  console.log('re-render MessageBox')
  const isMessageBoxHidden = useSelector(
    (state) => state.app.isMessageBoxHidden
  );
  const messageBoxText = useSelector((state) => state.app.messageBoxText);
  const messageBoxLevel = useSelector((state) => state.app.messageBoxLevel);
  return (
    <SnackBar
      hidden={isMessageBoxHidden}
      containerProps={{
        width: 'min-content',
        bgcolor: messageBoxLevel === 'success' ? colors.info : colors.error,
      }}
    >
      <TextBox
        containerProps={{ margin: '10px' }}
        text={messageBoxText}
        fontSize="17px"
        color="white"
      />
    </SnackBar>
  )
}

export default React.memo(MessageBox)
