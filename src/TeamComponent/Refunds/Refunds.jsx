import {
  Alert, Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { canManagePlatform } from "../../component/config/roles";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import usePagedQuery from "../common/usePagedQuery";
import { formatDateTime, formatMoney, humanize } from "../common/format";
import RefundDialog from "./RefundDialog";

const STATUSES = ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED", "FAILED"];

export default function Refunds() {
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("REQUESTED");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const query = usePagedQuery(teamApi.refunds, { q, status });
  const { data, loading, error, page, setPage, size, setSize, refresh } = query;

  const open = (row) => {
    teamApi.refund(row.id).then(setSelected)
      .catch((err) => setToast({ severity: "error", text: getErrorMessage(err, "Could not load the refund") }));
  };

  return (
    <div>
      <PageHeader title="Refunds" subtitle={`${data.totalElements} ${status ? humanize(status).toLowerCase() : ""} refunds`} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" label="Search customer or restaurant" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 300 }} />
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel id="refund-status-label">Status</InputLabel>
          <Select labelId="refund-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{humanize(s)}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Paper variant="outlined">
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Refund</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Requested</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((r) => (
                <TableRow key={r.id} hover sx={{ cursor: "pointer" }} onClick={() => open(r)}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell>#{r.orderId}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{r.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.customerEmail}</Typography>
                  </TableCell>
                  <TableCell>{r.restaurantName}</TableCell>
                  <TableCell align="right">{formatMoney(r.amount, r.currency)}</TableCell>
                  <TableCell>{humanize(r.method)}</TableCell>
                  <TableCell>{formatDateTime(r.requestedAt)}</TableCell>
                  <TableCell><StatusChip value={r.status} /></TableCell>
                </TableRow>
              ))}
              {!loading && data.content.length === 0 && (
                <TableRow><TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>No refunds match these filters.</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>}
        <TablePagination component="div" count={data.totalElements} page={page} onPageChange={(_, p) => setPage(p)}
          rowsPerPage={size} onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))} rowsPerPageOptions={[10, 20, 50]} />
      </Paper>

      <RefundDialog
        refund={selected}
        canManage={canManage}
        onClose={() => setSelected(null)}
        onChanged={(updated, message) => { setSelected(updated); setToast({ severity: "success", text: message }); refresh(); }}
        onError={(text) => setToast({ severity: "error", text })}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
