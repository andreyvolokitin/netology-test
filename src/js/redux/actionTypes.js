/* eslint-disable import/prefer-default-export */
const asyncActionType = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const API = asyncActionType('API');

export const FETCH_DATATABLE = asyncActionType('FETCH_DATATABLE');
export const MARK_DATATABLE_ROW = 'MARK_DATATABLE_ROW';
export const MARK_DATATABLE_FULL = 'MARK_DATATABLE_FULL';
