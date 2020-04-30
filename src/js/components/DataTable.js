/* eslint-disable no-shadow */

import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox, FormControlLabel, CircularProgress } from '@material-ui/core';
import Modernizr from 'modernizr';
import Stickyfill from 'stickyfilljs';
import { nanoid } from 'nanoid/non-secure';

import Scroll from './Scroll';
import { fetchDatatable, markDatatableRow, markDatatableFull } from '../redux/actions';

function DataTable({
  data = [],
  tableId,
  className = '',
  headerSecondaryContent = '',
  datatableStore,
  fetchDatatable,
  markDatatableRow,
  markDatatableFull,
}) {
  // eslint-disable-next-line consistent-return
  const headerRef = useCallback((node) => {
    if (node !== null && !Modernizr.csspositionsticky) {
      Stickyfill.add(node);
    }
  }, []);

  useEffect(() => {
    if (typeof data === 'string') {
      fetchDatatable(tableId, data);
    }
  }, []);

  const [cellId] = useState(nanoid);
  let headersCounter = 0;
  // eslint-disable-next-line no-return-assign
  const Cell = (Tagname, txt) => (
    <Tagname key={`${cellId}_${(headersCounter += 1)}`} className="datatable__table-data">
      <div className="datatable__table-cell">{txt}</div>
    </Tagname>
  );

  const EmptyMsg = ({ children }) => <div className="datatable__empty-msg">{children}</div>;

  function getContent() {
    let content = <EmptyMsg>Данные отсутствуют.</EmptyMsg>;

    if (typeof data === 'string') {
      content = (
        <EmptyMsg>
          {datatableStore[tableId] && datatableStore[tableId].status === 'pending' && (
            <>
              <CircularProgress className="datatable__spinner" size={'1em'} /> Загрузка...
            </>
          )}
          {datatableStore[tableId] && datatableStore[tableId].status === 'error' && (
            <>При загрузке данных произошла ошибка.</>
          )}
        </EmptyMsg>
      );
    }

    if (Array.isArray(data) && data.length > 0) {
      /* eslint-disable no-return-assign */
      content = (
        <>
          <div className="datatable__data">
            <div ref={headerRef} className="datatable__head sticky">
              <FormControlLabel
                control={
                  <Checkbox
                    // eslint-disable-next-line consistent-return
                    onChange={(e) => markDatatableFull(tableId, e.target.checked)}
                    checked={
                      datatableStore[tableId].data.filter((item) => !item.marked).length === 0
                    }
                    name="checkAll"
                  />
                }
                label="Выделить всё"
              />
              {headerSecondaryContent}
            </div>
            <Scroll className="datatable__content" direction="h">
              <table className="datatable__table table">
                <thead>
                  <tr>
                    <th className="datatable__table-head">
                      <div className="datatable__table-cell"></div>
                    </th>
                    <th className="datatable__table-fakehead">
                      <div className="datatable__table-cell"></div>
                    </th>
                    {data[0].tabular &&
                      Object.keys(data[0].tabular).map((field) => Cell('th', field))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    return (
                      <tr className={item.marked ? 'is-marked' : ''} key={item.id}>
                        <th className="datatable__table-head">
                          <div className="datatable__table-cell">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e) =>
                                    markDatatableRow(tableId, item.id, e.target.checked)
                                  }
                                  checked={item.marked}
                                  name="person"
                                  value={item.id}
                                />
                              }
                              label=""
                            />
                          </div>
                        </th>
                        <td className="datatable__table-fakehead">
                          <div className="datatable__table-cell">
                            <FormControlLabel control={<Checkbox disabled />} label="" />
                          </div>
                        </td>
                        {Object.keys(item.tabular)
                          .filter((field) => field !== 'id')
                          .map((field) => Cell('td', item.tabular[field]))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Scroll>
          </div>
        </>
      );
      /* eslint-enable */
    }

    return content;
  }

  return <div className={`${className} datatable`}>{getContent()}</div>;
}

const mapStateToProps = (state) => {
  return { datatableStore: state.datatable };
};
export default connect(mapStateToProps, {
  fetchDatatable,
  markDatatableRow,
  markDatatableFull,
})(DataTable);
