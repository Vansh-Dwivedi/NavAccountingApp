import React from 'react';
import Papa from 'papaparse';
import { Table } from 'antd';

const CSVReader = ({ data }) => {
  const parsedData = Papa.parse(data, { header: true });
  const columns = parsedData.meta.fields.map(field => ({
    title: field,
    dataIndex: field,
    key: field,
  }));

  return (
    <Table
      dataSource={parsedData.data}
      columns={columns}
      scroll={{ x: true }}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default CSVReader;
