import { FETCH_DATATABLE, MARK_DATATABLE_ROW, MARK_DATATABLE_FULL } from '../actionTypes';

export default function datatable(datatables = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_DATATABLE.PENDING:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'pending',
        },
      });
    case FETCH_DATATABLE.ERROR:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'error',
        },
      });
    case FETCH_DATATABLE.SUCCESS:
      return Object.assign({}, datatables, {
        [payload.tableId]: {
          status: 'success',
          data: payload.data,
        },
      });
    case MARK_DATATABLE_ROW:
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
    case MARK_DATATABLE_FULL:
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
