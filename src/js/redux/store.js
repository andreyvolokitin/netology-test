/* eslint-disable import/prefer-default-export */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import datatable from './reducers/datatable';
import apiMiddleware from './middleware/apiMiddleware';

const initialState = {
  datatable: {},
};

const store = createStore(
  combineReducers({ datatable }),
  initialState,
  applyMiddleware(apiMiddleware)
);

export default store;
