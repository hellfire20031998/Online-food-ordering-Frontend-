import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography
} from "@mui/material";
import React, { useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import StatusChip from "../common/StatusChip";
import { formatDate, formatDateTime, formatMoney } from "../common/format";

/**
 * Payout detail: totals, destination account, included payments, and mark-paid / cancel.
 * Used by the team console (canManage) and, read-only, by the restaurant owner.
 */
export default function PayoutDialog({ payout, canManage, onClose, onChanged, onError }) {
  const [mode, setMode] = useState(null); // null | pay
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  if (!payout) return null;
  const p = payout;

  const reset = () => { setMode(null); setReference(""); setNotes(""); };
  const close = () => { reset(); onClose(); };

  const run = async (fn, message) => {
    setBusy(true);
    try {
      const updated = await fn();
      reset();
      onChanged(updated, message);
    } catch (err) {
      onError(getErrorMessage(err, "Could not update the payout"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onClose={busy ? undefined : close} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <span>{p.restaurantName} · {formatDate(p.periodStart)} – {formatDate(p.periodEnd)}</span>
          <StatusChip value={p.status} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <Stat label="Gross" value={formatMoney(p.grossAmount, p.currency)} />
          <Stat label="Refunded" value={formatMoney(p.refundedAmount, p.currency)} />
          <Stat label="Commission" value={formatMoney(p.commissionAmount, p.currency)} />
          <Stat label="Net payout" value={formatMoney(p.netAmount, p.currency)} strong />
          <Stat label="Payments" value={p.paymentCount} />
        </div>

        <Typography variant="subtitle2" gutterBottom>Destination</Typography>
        {p.bankAccount ? (
          <Typography variant="body2">
            {p.bankAccount.accountHolderName} · {p.bankAccount.bankName} · {p.bankAccount.ifsc} · <span style={{ fontFamily: "monospace" }}>{p.bankAccount.accountNumber}</span>
            {p.bankAccount.masked && <Typography variant="caption" color="text.secondary"> (masked)</Typography>}
          </Typography>
        ) : (
          <Alert severity="warning">No payout account was on file when this payout was generated.</Alert>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Generated {formatDateTime(p.createdAt)} by {p.createdBy}
          {p.paidAt && <> · Paid {formatDateTime(p.paidAt)} by {p.paidBy} · Ref {p.referenceNumber}</>}
          {p.notes && <> · {p.notes}</>}
        </Typography>

        {p.payments && p.payments.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Included payments</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Paid at</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Refunded</TableCell>
                  <TableCell align="right">Commission %</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {p.payments.map((pay) => (
                  <TableRow key={pay.id}>
                    <TableCell>#{pay.orderId}</TableCell>
                    <TableCell>{formatDateTime(pay.paidAt)}</TableCell>
                    <TableCell align="right">{formatMoney(pay.amount, pay.currency)}</TableCell>
                    <TableCell align="right">{formatMoney(pay.refundedAmount, pay.currency)}</TableCell>
                    <TableCell align="right">{pay.commissionPercentage}%</TableCell>
                    <TableCell><StatusChip value={pay.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {mode === "pay" && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <TextField autoFocus size="small" label="Bank transfer reference (UTR / IMPS / NEFT id)" value={reference} onChange={(e) => setReference(e.target.value)} />
            <TextField size="small" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={busy}>Close</Button>
        {canManage && p.status === "PENDING" && !mode && (
          <>
            <Button color="error" disabled={busy}
              onClick={() => run(() => teamApi.cancelPayout(p.id), "Payout cancelled; its payments will be picked up by the next generation.")}>
              Cancel payout
            </Button>
            <Button variant="contained" color="success" onClick={() => setMode("pay")} disabled={busy || Number(p.netAmount) <= 0}>
              Record transfer…
            </Button>
          </>
        )}
        {mode === "pay" && (
          <>
            <Button onClick={reset} disabled={busy}>Back</Button>
            <Button variant="contained" color="success" disabled={busy || !reference.trim()}
              onClick={() => run(() => teamApi.markPayoutPaid(p.id, { referenceNumber: reference.trim(), notes: notes.trim() || null }),
                "Payout marked as paid. The owner has been emailed.")}>
              Mark paid
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

function Stat({ label, value, strong }) {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={strong ? 700 : 500}>{value}</Typography>
    </div>
  );
}
