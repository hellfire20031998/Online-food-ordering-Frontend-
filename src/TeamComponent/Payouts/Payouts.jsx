import {
  Alert, Box, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select,
  Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import usePagedQuery from "../common/usePagedQuery";
import { formatDate, formatMoney } from "../common/format";
import PayoutDialog from "./PayoutDialog";

const iso = (d) => d.toISOString().slice(0, 10);
const lastWeek = () => { const d = new Date(); d.setDate(d.getDate() - 7); return iso(d); };

/** Restaurant settlements. Rendered only for TEAM_ADMIN / TEAM_MANAGER (see TeamRoute). */
export default function Payouts() {
  const [status, setStatus] = useState("PENDING");
  const [from, setFrom] = useState(lastWeek());
  const [to, setTo] = useState(iso(new Date()));
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const query = usePagedQuery(teamApi.payouts, { status });
  const { data, loading, error, page, setPage, size, setSize, refresh } = query;

  const generate = async () => {
    setGenerating(true);
    try {
      const created = await teamApi.generatePayouts(from, to);
      setToast({ severity: "success", text: created.length === 0
        ? "Nothing to settle for that period."
        : `${created.length} payout${created.length === 1 ? "" : "s"} generated.` });
      setStatus("PENDING");
      refresh();
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not generate payouts") });
    } finally {
      setGenerating(false);
    }
  };

  const open = (row) => {
    teamApi.payout(row.id).then(setSelected)
      .catch((err) => setToast({ severity: "error", text: getErrorMessage(err, "Could not load the payout") }));
  };

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Settle restaurant earnings by bank transfer" />

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Generate payouts</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Creates one pending payout per restaurant from settled payments in the period that are not yet part of a payout.
            Commission is applied per payment at the rate in force when it was paid.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <TextField size="small" type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField size="small" type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={generate} disabled={generating || !from || !to}>
              {generating ? "Generating…" : "Generate"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="payout-status-label">Status</InputLabel>
          <Select labelId="payout-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
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
                <TableCell>Period</TableCell>
                <TableCell align="right">Payments</TableCell>
                <TableCell align="right">Gross</TableCell>
                <TableCell align="right">Refunded</TableCell>
                <TableCell align="right">Commission</TableCell>
                <TableCell align="right">Net</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((p) => (
                <TableRow key={p.id} hover sx={{ cursor: "pointer" }} onClick={() => open(p)}>
                  <TableCell>{p.restaurantName}</TableCell>
                  <TableCell>{formatDate(p.periodStart)} – {formatDate(p.periodEnd)}</TableCell>
                  <TableCell align="right">{p.paymentCount}</TableCell>
                  <TableCell align="right">{formatMoney(p.grossAmount, p.currency)}</TableCell>
                  <TableCell align="right">{formatMoney(p.refundedAmount, p.currency)}</TableCell>
                  <TableCell align="right">{formatMoney(p.commissionAmount, p.currency)}</TableCell>
                  <TableCell align="right"><strong>{formatMoney(p.netAmount, p.currency)}</strong></TableCell>
                  <TableCell><StatusChip value={p.status} /></TableCell>
                </TableRow>
              ))}
              {!loading && data.content.length === 0 && (
                <TableRow><TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>No payouts match this filter.</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={24} /></Box>}
        <TablePagination component="div" count={data.totalElements} page={page} onPageChange={(_, p) => setPage(p)}
          rowsPerPage={size} onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))} rowsPerPageOptions={[10, 20, 50]} />
      </Paper>

      <PayoutDialog
        payout={selected}
        canManage
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
