import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select,
  Snackbar, Stack, Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { canManagePlatform } from "../../component/config/roles";
import ConfirmDialog from "../common/ConfirmDialog";
import OrderDetailDialog from "../common/OrderDetailDialog";
import OrdersTable from "../common/OrdersTable";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import usePagedQuery from "../common/usePagedQuery";
import { formatDateTime } from "../common/format";
import CustomerBankAccountCard from "./CustomerBankAccountCard";

const ORDER_STATUSES = ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setCustomer(null);
    teamApi.customer(id)
      .then(setCustomer)
      .catch((err) => setError(getErrorMessage(err, "Could not load the customer")));
  }, [id]);

  const fetchOrders = useCallback((params) => teamApi.customerOrders(id, params), [id]);
  const ordersQuery = usePagedQuery(fetchOrders, { status });

  const toggleStatus = async () => {
    setBusy(true);
    try {
      const updated = customer.status === "BLOCKED"
        ? await teamApi.unblockCustomer(id)
        : await teamApi.blockCustomer(id);
      setCustomer(updated);
      setToast({ severity: "success", text: `${updated.email} is now ${updated.status.toLowerCase()}.` });
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not update the customer") });
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!customer) return <CircularProgress />;

  const blocked = customer.status === "BLOCKED";

  return (
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/team/customers")} sx={{ mb: 1 }}>
        All customers
      </Button>
      <PageHeader
        title={customer.fullName || customer.email}
        subtitle={customer.email}
        actions={canManage && (
          <Button variant="contained" color={blocked ? "success" : "error"} onClick={() => setConfirm(true)}>
            {blocked ? "Unblock" : "Block"}
          </Button>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Account</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <StatusChip value={customer.status} size="medium" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Joined {formatDateTime(customer.createdAt)}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Orders</Typography>
            <Typography variant="h4" fontWeight={600} sx={{ mt: 1 }}>{customer.totalOrders}</Typography>
            <Typography variant="body2" color="text.secondary">all time</Typography>
          </CardContent>
        </Card>
        {canManage ? (
          <CustomerBankAccountCard customerId={id} />
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">Refund account</Typography>
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Only team admins and managers can view saved bank details.
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Order history</Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="cust-order-status">Status</InputLabel>
          <Select labelId="cust-order-status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, " ")}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <OrdersTable query={ordersQuery} showCustomer={false} onSelect={setSelectedOrder} />
      <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      <ConfirmDialog
        open={confirm}
        busy={busy}
        title={blocked ? "Unblock customer?" : "Block customer?"}
        message={blocked
          ? `${customer.email} will be able to sign in and place orders again.`
          : `${customer.email} will be signed out on their next request and cannot sign in or order until unblocked.`}
        confirmLabel={blocked ? "Unblock" : "Block"}
        color={blocked ? "success" : "error"}
        onConfirm={toggleStatus}
        onClose={() => setConfirm(false)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
