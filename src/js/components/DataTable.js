/* eslint-disable no-shadow */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox, FormControlLabel, CircularProgress, IconButton } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import Modernizr from 'modernizr';
import Stickyfill from 'stickyfilljs';
import { nanoid } from 'nanoid/non-secure';
import { debounce } from 'throttle-debounce';

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
  const theadRef = useRef(null);
  const headerAnchorRef = useRef(null);
  let containerRef;

  function scrollToHeader() {
    headerAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (typeof data === 'string') {
      fetchDatatable(tableId, data);
    }

    const container = containerRef;
    const refresh = debounce(50, () => {
      // don't use IntersectionObserver due to support for older browsers,
      // and lack of time to implement 2 solutions
      const rect = theadRef.current.getBoundingClientRect();

      container.classList[
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          ? 'remove'
          : 'add'
      ]('is-scrolled');
    });

    window.addEventListener('scroll', refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    return () => {
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
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
          <div ref={headerAnchorRef} className="datatable__scroll-anchor"></div>
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
              <>
                {headerSecondaryContent}
                <IconButton
                  className="datatable__to-top"
                  onClick={scrollToHeader}
                  aria-label="В начало"
                >
                  <ArrowUpward />
                </IconButton>
              </>
            </div>
            <Scroll className="datatable__content" direction="h">
              <table className="datatable__table table">
                <thead ref={theadRef}>
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

  return (
    /* eslint-disable no-return-assign */
    <div ref={(r) => (containerRef = r)} className={`${className} datatable`}>
      {getContent()}
    </div>
    /* eslint-enable */
  );
}

const mapStateToProps = (state) => {
  return { datatableStore: state.datatable };
};
export default connect(mapStateToProps, {
  fetchDatatable,
  markDatatableRow,
  markDatatableFull,
})(DataTable);
