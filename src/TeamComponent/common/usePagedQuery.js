import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../component/config/api";

const EMPTY = { content: [], totalElements: 0, totalPages: 0 };

/**
 * Fetches one page of a backend PageResponse and tracks paging state.
 * `fetcher(params)` must be referentially stable (module function or useCallback).
 * Changing `filters` resets to the first page.
 */
export default function usePagedQuery(fetcher, filters = {}, initialSize = 20) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(0);
  }, [filtersKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher({ ...JSON.parse(filtersKey), page, size })
      .then((res) => {
        if (!cancelled) setData(res || EMPTY);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load data"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, filtersKey, page, size, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, page, setPage, size, setSize, refresh };
}
