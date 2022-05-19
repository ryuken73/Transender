/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/prefer-default-export */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import appReducer from 'renderer/appSlice';
import jobReducer from 'renderer/Components/Pages/MainTab/jobSlice';
import CONSTANTS from 'renderer/config/constants';

const { LOGLESS_REDUX_ACTIONS = ['jobSlice/updateJobProgress'] } = CONSTANTS;

const logger = createLogger({
  predicate: (getState, action) => !LOGLESS_REDUX_ACTIONS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    app: appReducer,
    job: jobReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});
