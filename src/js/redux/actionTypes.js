/* eslint-disable import/prefer-default-export */
const asyncActionType = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const API = asyncActionType('API');

export const DATATABLE_FETCH = asyncActionType('DATATABLE_FETCH');
export const DATATABLE_MARK_ROW = 'DATATABLE_MARK_ROW';
export const DATATABLE_MARK_FULL = 'DATATABLE_MARK_FULL';
