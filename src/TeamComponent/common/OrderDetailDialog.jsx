import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem,
  ListItemText, Stack, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { canManagePlatform } from "../../component/config/roles";
import IssueRefundDialog from "../Refunds/IssueRefundDialog";
import StatusChip from "./StatusChip";
import { formatDateTime, formatMoney, humanize } from "./format";

export default function OrderDetailDialog({ order, onClose, onRefundIssued }) {
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);
  const [issuing, setIssuing] = useState(false);

  if (!order) return null;
  const p = order.payment;
  const canRefund = canManage && p && Number(p.refundableAmount) > 0 && !p.hasOpenRefund;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <span>Order #{order.id}</span>
          <StatusChip value={order.orderStatus} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Row label="Placed" value={formatDateTime(order.createdAt)} />
          <Row label="Restaurant" value={order.restaurantName || (order.restaurantId ? `#${order.restaurantId}` : "—")} />
          <Row label="Customer" value={order.customerName ? `${order.customerName} (${order.customerEmail})` : order.customerEmail || "—"} />
          <Row label="Payment" value={humanize(order.paymentMethod)} />
          <Row label="Delivery address" value={order.deliveryAddress || "—"} />
        </Stack>

        {p && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Payment</Typography>
            <Stack spacing={0.5}>
              <Row label="Status" value={<StatusChip value={p.status} />} />
              <Row label="Provider" value={humanize(p.provider)} />
              <Row label="Amount" value={formatMoney(p.amount, p.currency)} />
              {Number(p.refundedAmount) > 0 && <Row label="Refunded" value={formatMoney(p.refundedAmount, p.currency)} />}
              {p.commissionAmount != null && <Row label="Commission" value={`${formatMoney(p.commissionAmount, p.currency)} (${p.commissionPercentage}%)`} />}
              {p.providerPaymentId && <Row label="Gateway id" value={p.providerPaymentId} />}
              {p.paidAt && <Row label="Paid at" value={formatDateTime(p.paidAt)} />}
              {p.failureReason && <Row label="Failure" value={p.failureReason} />}
              {p.hasOpenRefund && <Typography variant="caption" color="warning.main">A refund is in progress for this order.</Typography>}
            </Stack>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2">Items</Typography>
        <List dense disablePadding>
          {(order.items || []).map((item) => (
            <ListItem key={item.id} disableGutters>
              <ListItemText
                primary={`${item.quantity} × ${item.foodName || `Food #${item.foodId}`}`}
                secondary={formatMoney(item.price, p?.currency)}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Row label="Total" value={formatMoney(order.totalAmount, p?.currency)} strong />
      </DialogContent>
      <DialogActions>
        {canRefund && <Button color="warning" onClick={() => setIssuing(true)}>Issue refund…</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {issuing && (
        <IssueRefundDialog
          order={order}
          onClose={() => setIssuing(false)}
          onDone={(refund) => { setIssuing(false); onRefundIssued?.(refund); onClose(); }}
        />
      )}
    </Dialog>
  );
}

function Row({ label, value, strong }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" component="div" fontWeight={strong ? 600 : 400} textAlign="right">{value}</Typography>
    </Stack>
  );
}
