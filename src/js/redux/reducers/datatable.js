import { DATATABLE_FETCH, DATATABLE_MARK_ROW, DATATABLE_MARK_FULL } from '../actionTypes';

export default function datatable(datatables = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case DATATABLE_FETCH.PENDING:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'pending',
        },
      });
    case DATATABLE_FETCH.ERROR:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'error',
        },
      });
    case DATATABLE_FETCH.SUCCESS:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'success',
          data: payload.data,
        },
      });
    case DATATABLE_MARK_ROW:
      return {
        ...datatables,
        [payload.tableId]: Object.assign({}, datatables[payload.tableId], {
          data: datatables[payload.tableId].data.map((row) => {
            if (row.id === payload.rowId) {
              return {
                ...row,
                marked: payload.marked,
              };
            }

            return row;
          }),
        }),
      };
    case DATATABLE_MARK_FULL:
      return {
        ...datatables,
        [payload.tableId]: Object.assign({}, datatables[payload.tableId], {
          data: datatables[payload.tableId].data.map((row) => ({
            ...row,
            marked: payload.marked,
          })),
        }),
      };
    default:
      return datatables;
  }
}
