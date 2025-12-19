import { useState, useCallback } from 'react';
import Axios from '../services/api';
import { message } from 'antd';

export const useTableLogic = (endpoint, searchKey, initialSize = 5) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async (p = 1, ps = pageSize, s = search, extraFilters = {}) => {
    setLoading(true);
    try {
      const params = { page: p, limit: ps, ...extraFilters };
      if (s) params[searchKey] = s;
      
      const res = await Axios.get(endpoint, { params });
      
      setData(res.data?.rows ?? res.data ?? []);
      setTotal(res.data?.total ?? 0);
      setPage(p);
      setPageSize(ps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize, search, searchKey]);

  return { data, setData, loading, page, pageSize, total, search, setSearch, fetchData };
};