import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModalOpen, setStateValue } from 'renderer/appSlice';
import constants from 'renderer/config/constants';
import { date } from 'renderer/utils';

const { LOG_LEVEL } = constants;

export default function useAppState() {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.app.modalOpen);
  const appLog = useSelector((state) => state.app.appLog);
  const setModalOpenState = React.useCallback(
    (open) => {
      dispatch(setModalOpen({ open }));
    },
    [dispatch]
  );
  const setAppLogState = React.useCallback(
    (logMessage, logLevel = LOG_LEVEL.INFO) => {
      dispatch(
        setStateValue({
          key: 'appLog',
          value: {
            level: logLevel,
            message: logMessage,
            date: date.getLogDate()
          },
        })
      );
    },
    [dispatch]
  );
  return { modalOpen, appLog, setModalOpenState, setAppLogState };
}
