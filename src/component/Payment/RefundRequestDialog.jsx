import {
  Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "../config/api";
import { paymentApi } from "./paymentApi";

const EMPTY_BANK = { beneficiaryName: "", accountNumber: "", ifsc: "", upiId: "" };

/**
 * Customer raises a refund on their own order. Cash orders need a destination: the saved refund
 * account is prefilled when there is one, and new details can be saved for next time.
 */
export default function RefundRequestDialog({ order, onClose, onSubmitted }) {
  const payment = order?.payment;
  const cash = payment?.provider === "CASH_ON_DELIVERY";
  const max = Number(payment?.refundableAmount || 0);

  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(String(max));
  const [bank, setBank] = useState(EMPTY_BANK);
  const [hasSaved, setHasSaved] = useState(false);
  const [saveForLater, setSaveForLater] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!order || !cash) return;
    paymentApi.myBankAccount().then((saved) => {
      if (saved) {
        setHasSaved(true);
        setSaveForLater(false);
        setBank({
          beneficiaryName: saved.accountHolderName || "",
          accountNumber: saved.accountNumber || "",
          ifsc: saved.ifsc || "",
          upiId: saved.upiId || "",
        });
      }
    }).catch(() => { /* no saved account: user types details */ });
  }, [order, cash]);

  if (!order) return null;

  const amountNumber = Number(amount);
  const amountOk = amountNumber > 0 && amountNumber <= max + 1e-9;
  const bankOk = !cash || (bank.beneficiaryName.trim() && ((bank.accountNumber && bank.ifsc) || bank.upiId));
  const canSubmit = reason.trim() && amountOk && bankOk && !busy;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const body = { reason: reason.trim(), amount: amountNumber };
      if (cash) {
        body.bankAccount = {
          beneficiaryName: bank.beneficiaryName.trim(),
          accountNumber: bank.accountNumber.trim() || null,
          ifsc: bank.ifsc.trim().toUpperCase() || null,
          upiId: bank.upiId.trim() || null,
        };
        body.saveBankAccount = saveForLater;
      }
      const created = await paymentApi.requestRefund(order.id, body);
      onSubmitted(created);
    } catch (err) {
      setError(getErrorMessage(err, "Could not submit the refund request"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a refund for order #{order.id}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth margin="dense" label="What went wrong?" multiline minRows={2}
          value={reason} onChange={(e) => setReason(e.target.value)}
        />
        <TextField
          fullWidth margin="dense" type="number" label={`Amount (up to ${max.toFixed(2)})`}
          value={amount} onChange={(e) => setAmount(e.target.value)}
          inputProps={{ min: 0.01, max, step: 0.01 }}
          error={Boolean(amount) && !amountOk}
        />
        {cash ? (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Where should we send the money?</Typography>
            <Typography variant="caption" color="text.secondary">
              You paid in cash, so we refund by bank transfer. Give an account number with IFSC, or a UPI id.
              {hasSaved && " Prefilled from your saved refund account."}
            </Typography>
            <TextField fullWidth margin="dense" label="Account holder name" value={bank.beneficiaryName}
              onChange={(e) => setBank({ ...bank, beneficiaryName: e.target.value })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
              <TextField fullWidth margin="dense" label="Account number" value={bank.accountNumber}
                onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} />
              <TextField fullWidth margin="dense" label="IFSC" value={bank.ifsc}
                onChange={(e) => setBank({ ...bank, ifsc: e.target.value })} />
            </div>
            <TextField fullWidth margin="dense" label="UPI id (alternative)" placeholder="name@bank" value={bank.upiId}
              onChange={(e) => setBank({ ...bank, upiId: e.target.value })} />
            <FormControlLabel
              control={<Checkbox checked={saveForLater} onChange={(e) => setSaveForLater(e.target.checked)} />}
              label={hasSaved ? "Update my saved refund account with these details" : "Save these details to my profile for future refunds"}
            />
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Approved refunds go back to your original payment method within 5 to 10 business days.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit}>Submit request</Button>
      </DialogActions>
    </Dialog>
  );
}
