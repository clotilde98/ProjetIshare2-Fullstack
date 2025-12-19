import { Table, Input, Button, Space, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Datable.js

export const TableHeader = ({ search, onSearch, onAdd, placeholder, type = "text", filter }) => (
  <Space style={{ marginBottom: 16, justifyContent: 'space-between' }}>
    <Space size="middle">
      {type === "date" ? (
        <DatePicker
          placeholder={placeholder}
          format="YYYY-MM-DD"
          value={search ? dayjs(search, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => onSearch(dateString || '')}
          allowClear
        />
      ) : (
        <Input.Search 
          placeholder={placeholder} 
          value={search} 
          onSearch={onSearch} 
          onChange={(e) => onSearch(e.target.value)} 
          style={{ width: 300 }} 
          allowClear 
        />
      )}
      
      {/* Insertion du composant de filtre ici */}
      {filter && <div className="table-filter-item">{filter}</div>}
    </Space>

    {onAdd && (
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Ajouter
      </Button>
    )}
  </Space>
);

export const CustomTable = ({ styles, columns, dataSource, loading, page, pageSize, total, onChange }) => (
  <Table
    className={styles?.customTable}
    columns={columns}
    dataSource={dataSource}
    loading={loading}
    rowKey="id"
    pagination={{
      current: page,
      pageSize: pageSize,
      total: total,
      onChange: (p, ps) => onChange(p, ps),
      showSizeChanger: true
    }}
  />
);