import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert, Button, Card, CardContent, Chip, CircularProgress, FormControl, InputLabel, MenuItem,
  Select, Snackbar, Stack, Typography
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
import BankAccountCard from "./BankAccountCard";

const ORDER_STATUSES = ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setRestaurant(null);
    teamApi.restaurant(id)
      .then(setRestaurant)
      .catch((err) => setError(getErrorMessage(err, "Could not load the restaurant")));
  }, [id]);

  const fetchOrders = useCallback((params) => teamApi.restaurantOrders(id, params), [id]);
  const ordersQuery = usePagedQuery(fetchOrders, { status });

  const toggleStatus = async () => {
    setBusy(true);
    try {
      const updated = restaurant.status === "SUSPENDED"
        ? await teamApi.reactivateRestaurant(id)
        : await teamApi.suspendRestaurant(id);
      setRestaurant(updated);
      setToast({ severity: "success", text: `${updated.name} is now ${updated.status.toLowerCase()}.` });
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not update the restaurant") });
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!restaurant) return <CircularProgress />;

  const suspended = restaurant.status === "SUSPENDED";

  return (
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/team/restaurants")} sx={{ mb: 1 }}>
        All restaurants
      </Button>
      <PageHeader
        title={restaurant.name}
        subtitle={[restaurant.cuisineType, restaurant.city].filter(Boolean).join(" · ")}
        actions={canManage && (
          <Button variant="contained" color={suspended ? "success" : "error"} onClick={() => setConfirm(true)}>
            {suspended ? "Reactivate" : "Suspend"}
          </Button>
        )}
      />

      <div className={`grid grid-cols-1 ${canManage ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 mb-6`}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Status</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <StatusChip value={restaurant.status} size="medium" />
              <Chip label={restaurant.open ? "Open for orders" : "Closed by owner"} color={restaurant.open ? "success" : "default"} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Registered {formatDateTime(restaurant.registrationDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {restaurant.totalOrders} orders all time
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Owner</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{restaurant.ownerName || "—"}</Typography>
            <Typography variant="body2" color="text.secondary">{restaurant.ownerEmail}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Details</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{restaurant.description || "No description."}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hours: {restaurant.openingHours || "—"}
            </Typography>
          </CardContent>
        </Card>
        {canManage && <BankAccountCard restaurantId={id} />}
      </div>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Orders</Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="rest-order-status">Status</InputLabel>
          <Select labelId="rest-order-status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, " ")}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <OrdersTable query={ordersQuery} showRestaurant={false} onSelect={setSelectedOrder} />
      <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      <ConfirmDialog
        open={confirm}
        busy={busy}
        title={suspended ? "Reactivate restaurant?" : "Suspend restaurant?"}
        message={suspended
          ? `${restaurant.name} will be visible to customers again and can receive orders.`
          : `${restaurant.name} will be hidden from customers and will not receive new orders until reactivated.`}
        confirmLabel={suspended ? "Reactivate" : "Suspend"}
        color={suspended ? "success" : "error"}
        onConfirm={toggleStatus}
        onClose={() => setConfirm(false)}
      />

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
