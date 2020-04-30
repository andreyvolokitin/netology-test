import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../redux/store';

import CoworkersList from '../components/Coworkers';

ReactDOM.render(
  <Provider store={store}>
    <CoworkersList data="/COWORKERS_DATA.json" />
  </Provider>,
  document.getElementById('root')
);
