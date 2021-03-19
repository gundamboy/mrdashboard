import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import TableWrapper from '../AntTables.styles';
import {useDispatch, useSelector} from "react-redux";
import scholarshipsActions from "../../../../redux/scholarships/actions";

export default function({ dataList, tableInfo, bordered, size, pagination, loading, expandable }) {
  const [state, setState] = useState(dataList.getAll());
  const dispatch = useDispatch();

  const setColumnSorter = useCallback(
      (sorter) => dispatch(scholarshipsActions.setScholarshipTableSorter(sorter)),
      [dispatch]
  );

  function onChange(pagination, filters, sorter) {
    setColumnSorter(sorter);

    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      setState(dataList.getAll());
    }
  }
  return (
    <TableWrapper
      columns={tableInfo.columns}
      onChange={onChange}
      dataSource={state}
      bordered={bordered}
      size={size}
      pagination={pagination}
      loading={loading}
      expandable={expandable}
      className="isoSortingTable"
    />
  );
}
