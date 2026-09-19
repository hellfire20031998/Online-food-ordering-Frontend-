import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useSearchParams } from "react-router-dom";
import RestaurantCart from "../Restaurant/RestaurantCart";
import DishResult from "./DishResult";
import { searchAll } from "./searchApi";
import { getErrorMessage } from "../config/api";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 350;

/** Site-wide search page: `/search?q=...`. Searches restaurants and dishes as the visitor types. */
export default function Search() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const [text, setText] = useState(urlQuery);
  const [results, setResults] = useState(null); // { restaurants, dishes } for the last completed query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const latest = useRef(0);

  // Keep the URL in sync so results can be shared and survive a refresh.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = text.trim();
      if (q !== urlQuery) setParams(q ? { q } : {}, { replace: true });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [text, urlQuery, setParams]);

  useEffect(() => {
    const q = urlQuery.trim();
    if (q.length < MIN_CHARS) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }
    const requestId = ++latest.current;
    setLoading(true);
    setError(null);
    searchAll(q)
      .then((data) => { if (requestId === latest.current) setResults(data); })
      .catch((err) => { if (requestId === latest.current) setError(getErrorMessage(err, "Search failed")); })
      .finally(() => { if (requestId === latest.current) setLoading(false); });
  }, [urlQuery]);

  const retry = () => setParams({ q: urlQuery, r: String(Date.now()) }, { replace: true });
  const total = results ? results.restaurants.length + results.dishes.length : 0;

  return (
    <div className="px-4 sm:px-10 lg:px-20 py-6 lg:py-10 max-w-6xl mx-auto">
      <TextField
        autoFocus
        fullWidth
        placeholder="Search restaurants, cuisines or dishes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        inputProps={{ "aria-label": "Search", enterKeyHint: "search" }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          endAdornment: text ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="Clear search" onClick={() => setText("")}><ClearIcon /></IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <div className="mt-6 space-y-8">
        {urlQuery.trim().length > 0 && urlQuery.trim().length < MIN_CHARS && (
          <Typography color="text.secondary">Type at least {MIN_CHARS} characters to search.</Typography>
        )}

        {loading && !results && (
          <div className="flex items-center gap-3 text-gray-400 py-6">
            <CircularProgress size={22} />
            <span>Searching…</span>
          </div>
        )}

        {error && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={retry}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {results && !error && total === 0 && (
          <Typography color="text.secondary" sx={{ py: 4 }}>
            Nothing matched “{urlQuery.trim()}”. Try a dish, a cuisine or a restaurant name.
          </Typography>
        )}

        {results?.restaurants.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-300 pb-4">
              Restaurants <span className="text-gray-500 text-base font-normal">({results.restaurants.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.restaurants.map((r) => <RestaurantCart key={r.id} item={r} />)}
            </div>
          </section>
        )}

        {results?.dishes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-300 pb-4">
              Dishes <span className="text-gray-500 text-base font-normal">({results.dishes.length})</span>
            </h2>
            <div className="space-y-3">
              {results.dishes.map((d) => <DishResult key={d.id} dish={d} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
