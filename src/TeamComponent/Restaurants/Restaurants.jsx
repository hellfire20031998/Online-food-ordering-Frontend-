import {
  Alert, Box, Button, Chip, CircularProgress, FormControl, InputLabel, Link, MenuItem, Paper, Select,
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

export default function Restaurants() {
  const navigate = useNavigate();
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(null); // restaurant awaiting confirmation
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const query = usePagedQuery(teamApi.restaurants, { q, status });
  const { data, loading, error, page, setPage, size, setSize, refresh } = query;

  const toggleStatus = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const suspended = pending.status === "SUSPENDED";
      const updated = suspended
        ? await teamApi.reactivateRestaurant(pending.id)
        : await teamApi.suspendRestaurant(pending.id);
      setToast({ severity: "success", text: `${updated.name} is now ${updated.status.toLowerCase()}.` });
      refresh();
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not update the restaurant") });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <div>
      <PageHeader title="Restaurants" subtitle={`${data.totalElements} restaurants on the platform`} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search name, cuisine or owner email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="restaurant-status-label">Status</InputLabel>
          <Select labelId="restaurant-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
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
                <TableCell>Cuisine</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell>Open</TableCell>
                <TableCell>Status</TableCell>
                {canManage && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Link component="button" underline="hover" onClick={() => navigate(`/team/restaurants/${r.id}`)}>
                      {r.name}
                    </Link>
                  </TableCell>
                  <TableCell>{r.cuisineType || "—"}</TableCell>
                  <TableCell>{r.city || "—"}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{r.ownerName || "—"}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.ownerEmail}</Typography>
                  </TableCell>
                  <TableCell>{formatDate(r.registrationDate)}</TableCell>
                  <TableCell align="right">{r.totalOrders}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.open ? "Open" : "Closed"} color={r.open ? "success" : "default"} />
                  </TableCell>
                  <TableCell><StatusChip value={r.status} /></TableCell>
                  {canManage && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color={r.status === "SUSPENDED" ? "success" : "error"}
                        onClick={() => setPending(r)}
                      >
                        {r.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!loading && data.content.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canManage ? 9 : 8}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No restaurants match these filters.
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
        title={pending?.status === "SUSPENDED" ? "Reactivate restaurant?" : "Suspend restaurant?"}
        message={
          pending?.status === "SUSPENDED"
            ? `${pending?.name} will be visible to customers again and can receive orders.`
            : `${pending?.name} will be hidden from customers and will not receive new orders until reactivated.`
        }
        confirmLabel={pending?.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
        color={pending?.status === "SUSPENDED" ? "success" : "error"}
        onConfirm={toggleStatus}
        onClose={() => setPending(null)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
