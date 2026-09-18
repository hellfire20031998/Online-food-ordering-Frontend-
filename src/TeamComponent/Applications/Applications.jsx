import {
  Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { canOnboardRestaurants } from "../../component/config/roles";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import usePagedQuery from "../common/usePagedQuery";
import { formatDateTime } from "../common/format";
import ApplicationDialog from "./ApplicationDialog";

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"];

export default function Applications() {
  const navigate = useNavigate();
  const role = useSelector(store => store.auth.user?.role);
  const canReview = canOnboardRestaurants(role);

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const query = usePagedQuery(teamApi.applications, { q, status });
  const { data, loading, error, page, setPage, size, setSize, refresh } = query;

  const openDetail = (row) => {
    teamApi.application(row.id)
      .then(setSelected)
      .catch((err) => setToast({ severity: "error", text: getErrorMessage(err, "Could not load the application") }));
  };

  return (
    <div>
      <PageHeader title="Restaurant applications" subtitle={`${data.totalElements} ${status ? status.toLowerCase() : ""} applications`} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search restaurant, city or applicant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="app-status-label">Status</InputLabel>
          <Select labelId="app-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Paper variant="outlined">
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Restaurant</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Cuisine</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((a) => (
                <TableRow key={a.id} hover sx={{ cursor: "pointer" }} onClick={() => openDetail(a)}>
                  <TableCell>{a.restaurantName}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{a.applicantName}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.applicantEmail}</Typography>
                  </TableCell>
                  <TableCell>{a.city}</TableCell>
                  <TableCell>{a.cuisineType}</TableCell>
                  <TableCell>{formatDateTime(a.submittedAt)}</TableCell>
                  <TableCell><StatusChip value={a.status} /></TableCell>
                  <TableCell align="right">
                    {a.status === "APPROVED" && a.restaurantId ? (
                      <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/team/restaurants/${a.restaurantId}`); }}>
                        Restaurant
                      </Button>
                    ) : (
                      <Button size="small" onClick={(e) => { e.stopPropagation(); openDetail(a); }}>
                        {a.status === "PENDING" && canReview ? "Review" : "View"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && data.content.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No applications match these filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>}
        <TablePagination
          component="div"
          count={data.totalElements}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Paper>

      <ApplicationDialog
        application={selected}
        canReview={canReview}
        onClose={() => setSelected(null)}
        onChanged={(updated, message) => {
          setSelected(updated);
          setToast({ severity: "success", text: message });
          refresh();
        }}
        onError={(text) => setToast({ severity: "error", text })}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
