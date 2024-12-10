import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/db';

const supabase = createClient(config.projectUrl, config.key);

export const useFetchAll = (table) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0); // Total records count for pagination
  
    /**
     * fetchAll function with optional pagination
     * @param {Object} options - Options for search and pagination
     * @param {Object} options.searchParams - Fields and keywords to search
     * @param {boolean} options.pagination - Whether to use pagination
     * @param {number} options.limit - Number of items per page (if pagination is enabled)
     * @param {number} options.page - Current page number (if pagination is enabled)
     * @param {string} options.fields - Fields to select
     * @param {Object} options.additionalFilters - Additional filters
     */

    const fetchAll = async ({
      searchParams = {},
      pagination = false,
      limit = 10,
      page = 1,
      fields = '*',
      additionalFilters = {} // Parameter baru untuk kondisi tambahan
    } = {}) => {
      setLoading(true);
      setError(null);
    
      try {
        // Membuat query OR untuk pencarian multi-field
        const searchQuery = Object.keys(searchParams)
          .map((field) => `${field}.ilike.%${searchParams[field]}%`)
          .join(',');
    
        let query = supabase.from(table).select(fields);
    
        // Menerapkan filter pencarian jika ada searchParams
        if (searchQuery) {
          query = query.or(searchQuery);
        }
    
        // Menerapkan filter tambahan
        Object.keys(additionalFilters).forEach((key) => {
          const filter = additionalFilters[key];
          
          // Memeriksa jenis filter: bisa berupa objek { operator: value } atau nilai langsung
          if (typeof filter === 'object' && filter !== null) {
            Object.keys(filter).forEach((operator) => {
              if (filter[operator] !== undefined && filter[operator] !== null) {
                switch (operator) {
                  case 'gt': query = query.gt(key, filter[operator]); break;
                  case 'gte': query = query.gte(key, filter[operator]); break;
                  case 'lt': query = query.lt(key, filter[operator]); break;
                  case 'lte': query = query.lte(key, filter[operator]); break;
                  case 'neq': query = query.neq(key, filter[operator]); break;
                  // Tambahkan operator lain sesuai kebutuhan
                  default: break;
                }
              }
            });
          } else if (filter !== undefined && filter !== null) {
            // Jika filter adalah nilai langsung, terapkan sebagai kesetaraan
            query = query.eq(key, filter);
          }
        });
    
        // Mengurutkan data berdasarkan tanggal pembuatan
        query = query.order('created_at', { ascending: false });
    
        // Menerapkan pagination jika diaktifkan
        if (pagination) {
          const from = (page - 1) * limit;
          const to = page * limit - 1;
    
          // Mendapatkan total data hanya jika pagination diaktifkan
          const { data: countData, error: countError } = await supabase
            .from(table)
            .select(fields, { count: 'exact', head: true });
          if (countError) throw countError;
          setTotal(countData.length);
    
          // Menerapkan range untuk pagination
          query = query.range(from, to);
        }
    
        // Mengambil data
        const { data: fetchedData, error: fetchError } = await query;
    
        if (fetchError) throw fetchError;
    
        setData(fetchedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    return { data, loading, error, total, fetchAll };
    
};

export const useStore = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const store = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const { data: newData, error: insertError } = await supabase
        .from(table)
        .insert(values)
        .select();

      if (insertError) throw insertError;

      return { data: newData, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { store, loading, error };
};

export const useUpdate = (table) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const update = async (values, id) => {
      setLoading(true);
      setError(null);
  
      try {
        const { data: updatedData, error: updateError } = await supabase
          .from(table)
          .update(values)
          .eq('id', id)
          .select();
  
        if (updateError) throw updateError;
  
        return { data: updatedData, error: null };
      } catch (err) {
        setError(err);
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    };
  
    return { update, loading, error };
};

export const useDelete = (table) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const deleteData = async (id) => {
      setLoading(true);
      setError(null);
  
      try {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
  
        if (deleteError) throw deleteError;
  
        return { data: null, error: null };
      } catch (err) {
        setError(err);
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    };
  
    return { deleteData, loading, error };
};