import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography
} from "@mui/material";
import React, { useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { formatMoney } from "../common/format";

/** Team-initiated refund on an order (admin / manager). Approved immediately. */
export default function IssueRefundDialog({ order, onClose, onDone }) {
  const payment = order?.payment;
  const cash = payment?.provider === "CASH_ON_DELIVERY";
  const max = Number(payment?.refundableAmount || 0);

  const [amount, setAmount] = useState(String(max));
  const [reason, setReason] = useState("");
  const [bank, setBank] = useState({ beneficiaryName: "", accountNumber: "", ifsc: "", upiId: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!order || !payment) return null;

  const amountNumber = Number(amount);
  const amountOk = amountNumber > 0 && amountNumber <= max + 1e-9;
  const bankOk = !cash || (bank.beneficiaryName.trim() && ((bank.accountNumber && bank.ifsc) || bank.upiId));

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const body = { orderId: order.id, amount: amountNumber, reason: reason.trim() };
      if (cash) {
        body.bankAccount = {
          beneficiaryName: bank.beneficiaryName.trim(), accountNumber: bank.accountNumber || null,
          ifsc: bank.ifsc ? bank.ifsc.toUpperCase() : null, upiId: bank.upiId || null,
        };
      }
      const created = await teamApi.createRefund(body);
      onDone(created);
    } catch (err) {
      setError(getErrorMessage(err, "Could not issue the refund"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Issue refund for order #{order.id}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Refundable: {formatMoney(max, payment.currency)}.
          {cash ? " Cash order: the refund is a manual bank transfer to the customer." : " The refund goes back through the payment gateway."}
        </Typography>
        <TextField fullWidth margin="dense" type="number" label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}
          inputProps={{ min: 0.01, max, step: 0.01 }} error={Boolean(amount) && !amountOk} />
        <TextField fullWidth margin="dense" label="Reason" multiline minRows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        {cash && (
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="Beneficiary name" value={bank.beneficiaryName} onChange={(e) => setBank({ ...bank, beneficiaryName: e.target.value })} />
            <Stack direction="row" spacing={1}>
              <TextField size="small" fullWidth label="Account number" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} />
              <TextField size="small" fullWidth label="IFSC" value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value })} />
            </Stack>
            <TextField size="small" label="UPI id (alternative)" value={bank.upiId} onChange={(e) => setBank({ ...bank, upiId: e.target.value })} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={busy || !reason.trim() || !amountOk || !bankOk}>Issue refund</Button>
      </DialogActions>
    </Dialog>
  );
}
