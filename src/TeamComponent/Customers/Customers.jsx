import {
  Alert, Box, Button, CircularProgress, FormControl, InputLabel, Link, MenuItem, Paper, Select,
  Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { canManagePlatform } from "../../component/config/roles";
import ConfirmDialog from "../common/ConfirmDialog";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import usePagedQuery from "../common/usePagedQuery";
import { formatDate } from "../common/format";

export default function Customers() {
  const navigate = useNavigate();
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const query = usePagedQuery(teamApi.customers, { q, status });
  const { data, loading, error, page, setPage, size, setSize, refresh } = query;

  const toggleStatus = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const blocked = pending.status === "BLOCKED";
      const updated = blocked
        ? await teamApi.unblockCustomer(pending.id)
        : await teamApi.blockCustomer(pending.id);
      setToast({ severity: "success", text: `${updated.fullName || updated.email} is now ${updated.status.toLowerCase()}.` });
      refresh();
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not update the customer") });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${data.totalElements} customer accounts`} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="customer-status-label">Status</InputLabel>
          <Select labelId="customer-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="BLOCKED">Blocked</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Paper variant="outlined">
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell>Status</TableCell>
                {canManage && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Link component="button" underline="hover" onClick={() => navigate(`/team/customers/${c.id}`)}>
                      {c.fullName || "—"}
                    </Link>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                  <TableCell align="right">{c.totalOrders}</TableCell>
                  <TableCell><StatusChip value={c.status} /></TableCell>
                  {canManage && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color={c.status === "BLOCKED" ? "success" : "error"}
                        onClick={() => setPending(c)}
                      >
                        {c.status === "BLOCKED" ? "Unblock" : "Block"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!loading && data.content.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canManage ? 6 : 5}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No customers match these filters.
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

      <ConfirmDialog
        open={Boolean(pending)}
        busy={busy}
        title={pending?.status === "BLOCKED" ? "Unblock customer?" : "Block customer?"}
        message={
          pending?.status === "BLOCKED"
            ? `${pending?.email} will be able to sign in and place orders again.`
            : `${pending?.email} will be signed out on their next request and cannot sign in or order until unblocked.`
        }
        confirmLabel={pending?.status === "BLOCKED" ? "Unblock" : "Block"}
        color={pending?.status === "BLOCKED" ? "success" : "error"}
        onConfirm={toggleStatus}
        onClose={() => setPending(null)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
