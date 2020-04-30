/* eslint-disable consistent-return */
import { API } from '../actionTypes';
import { apiPending, apiSuccess, apiError } from '../actions';

const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type !== API) {
    return next(action);
  }

  const { payload } = action;
  const handleError = (error) => {
    dispatch(apiError(error));
    dispatch({ type: payload.ERROR, error: true, payload: Object.assign(payload, { error }) });
  };

  dispatch(apiPending());
  dispatch({ type: payload.PENDING, payload });

  // emulate delay
  setTimeout(() => {
    fetch(action.payload.url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          response.json().then((data) => {
            dispatch(apiSuccess(data));
            dispatch({ type: payload.SUCCESS, payload: Object.assign(payload, { data }) });
          });
        } else {
          handleError(response.status);
        }
      })
      .catch(handleError);
  }, 600);
};

export default apiMiddleware;
