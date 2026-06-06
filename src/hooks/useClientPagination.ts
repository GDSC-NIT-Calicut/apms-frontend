import { useState, useCallback, useEffect } from 'react';

/**
 * Client-side pagination hook (chunks a full array into pages)
 * Use when backend doesn't support pagination and you still want incremental rendering.
 */
export const useClientPagination = <T,>(items: T[] = [], pageSize = 15) => {
  const [page, setPage] = useState(1);

  // Reset page when the source items change
  useEffect(() => {
    setPage(1);
  }, [items]);

  const current = items.slice(0, page * pageSize);
  const hasMore = current.length < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setPage(p => p + 1);
  }, [hasMore]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return { items: current, loadMore, hasMore, reset };
};

export default useClientPagination;
