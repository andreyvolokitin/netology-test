import React, { useState } from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { Button } from '@material-ui/core';

import DataTable from './DataTable';

function Coworkers({ data, datatableStore }) {
  const [id] = useState(nanoid);
  const coworkersData = datatableStore[id] && datatableStore[id].data;

  let footerEl;
  const checkDetailsBtn = () => (
    <Button className="coworkers__details" onClick={scrollToFooter} variant="outlined" size="small">
      Смотреть
    </Button>
  );

  function scrollToFooter() {
    footerEl.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  /* eslint-disable no-return-assign */
  return (
    <div className="coworkers">
      <h3 className="coworkers__head">Список сотрудников</h3>
      <DataTable
        tableId={id}
        className="coworkers__data"
        data={coworkersData || data || []}
        headerSecondaryContent={
          <>
            {coworkersData && coworkersData.filter((coworker) => coworker.marked).length > 0
              ? checkDetailsBtn()
              : ''}
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
