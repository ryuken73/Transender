import React from 'react';

export default function useMessage(initMessage) {
  const [message, setMessage] = React.useState(initMessage);
  const showMessage = React.useCallback(message => {
    setMessage(message);
  }, [setMessage]);
  return {message, showMessage};
}
