import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Fetch 
  const fetchLinks = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLinks(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks(true); // Only initial load shows spinner
  }, [fetchLinks]);

  const addLink = async (link) => {
    const { data, error: insertError } = await supabase
      .from('links')
      .insert([link])
      .select();

    if (insertError) throw insertError;
    if (data) setLinks(prev => [data[0], ...prev]);
  };

  const updateLink = async (id, updates) => {
    const { error: updateError } = await supabase
      .from('links')
      .update(updates)
      .eq('id', id);

    if (updateError) throw updateError;
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLink = async (id) => {
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const categories = ['All', ...new Set(links.map((l) => l.category).filter(Boolean))];

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      !searchQuery ||
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || link.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return {
    links: filteredLinks,
    allLinks: links,
    loading,
    error,
    categories,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    addLink,
    updateLink,
    deleteLink,
    refetch: fetchLinks,
  };
}
