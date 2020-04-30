import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { Button, IconButton } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import { debounce } from 'throttle-debounce';

import DataTable from './DataTable';
import isInViewport from '../util/is-in-viewport';

function Coworkers({ data, datatableStore }) {
  const [id] = useState(nanoid);
  const coworkersData = datatableStore[id] && datatableStore[id].data;

  let containerEl;
  let headerEl;
  let footerEl;
  const checkDetailsBtn = () => (
    <Button className="coworkers__details" onClick={scrollToFooter} variant="outlined" size="small">
      Смотреть
    </Button>
  );

  function scrollToFooter() {
    footerEl.scrollIntoView({ behavior: 'smooth' });
  }
  function scrollToHeader() {
    headerEl.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    const header = headerEl;
    const container = containerEl;
    const refresh = debounce(0, () =>
      // don't use IntersectionObserver due to support for older browsers,
      // and lack of time to implement 2 solutions
      container.classList[isInViewport(header) ? 'remove' : 'add']('is-scrolled')
    );

    window.addEventListener('scroll', refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    return () => {
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, []);

  /* eslint-disable no-return-assign */
  return (
    <div ref={(r) => (containerEl = r)} className="coworkers">
      <h3 ref={(r) => (headerEl = r)} className="coworkers__head">
        Список сотрудников
      </h3>
      <DataTable
        tableId={id}
        className="coworkers__data"
        data={coworkersData || data || []}
        headerSecondaryContent={
          <>
            {coworkersData && coworkersData.filter((coworker) => coworker.marked).length > 0
              ? checkDetailsBtn()
              : ''}
            <IconButton
              className="coworkers__to-top"
              onClick={scrollToHeader}
              aria-label="В начало"
            >
              <ArrowUpward />
            </IconButton>
          </>
        }
      />
      {coworkersData && coworkersData.filter((coworker) => coworker.marked).length > 0 && (
        <div ref={(r) => (footerEl = r)} className="coworkers__foot">
          Пользователи:
          {coworkersData
            .filter((coworker) => coworker.marked)
            .map((coworker, i) => `${i > 0 ? ',' : ''} ${coworker.tabular.Имя}`)}
        </div>
      )}
    </div>
  );
  /* eslint-enable */
}

const mapStateToProps = (state) => {
  return { datatableStore: state.datatable };
};
export default connect(mapStateToProps)(Coworkers);
