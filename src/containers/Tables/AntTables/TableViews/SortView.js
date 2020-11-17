import React from 'react';
import TableWrapper from '../AntTables.styles';

export default function({ dataList, tableInfo, bordered, size, pagination, loading, expandable }) {
  const [state, setState] = React.useState(dataList.getAll());

  function onChange(pagination, filters, sorter) {
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
