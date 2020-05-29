import { API, DATATABLE_FETCH, DATATABLE_MARK_FULL, DATATABLE_MARK_ROW } from './actionTypes';

export const apiPending = () => ({
  type: API.PENDING,
});
export const apiSuccess = (response) => ({
  type: API.SUCCESS,
  payload: response,
});
export const apiError = (error) => ({
  type: API.ERROR,
  error: true,
  payload: error,
});

export const fetchDatatable = (tableId, url) => ({
  type: API,
  payload: Object.assign({ tableId, url }, DATATABLE_FETCH),
});
export const markDatatableRow = (tableId, rowId, marked) => ({
  type: DATATABLE_MARK_ROW,
  payload: { tableId, rowId, marked },
});
export const markDatatableFull = (tableId, marked) => ({
  type: DATATABLE_MARK_FULL,
  payload: { tableId, marked },
});
