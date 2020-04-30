import { API, FETCH_DATATABLE, MARK_DATATABLE_FULL, MARK_DATATABLE_ROW } from './actionTypes';

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
  payload: Object.assign({ tableId, url }, FETCH_DATATABLE),
});
export const markDatatableRow = (tableId, rowId, marked) => ({
  type: MARK_DATATABLE_ROW,
  payload: { tableId, rowId, marked },
});
export const markDatatableFull = (tableId, marked) => ({
  type: MARK_DATATABLE_FULL,
  payload: { tableId, marked },
});
