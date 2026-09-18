import {
  Alert, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Stack, TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "../config/api";
import { paymentApi } from "../Payment/paymentApi";

const EMPTY = { accountHolderName: "", accountNumber: "", ifsc: "", bankName: "", upiId: "" };
const fmt = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

/** /my-profile/refund-account: where cash-on-delivery refunds are sent. */
export default function RefundAccount() {
  const [account, setAccount] = useState(undefined); // undefined = loading, null = none
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    paymentApi.myBankAccount()
      .then(setAccount)
      .catch((err) => setError(getErrorMessage(err, "Could not load your refund account")));
  };

  useEffect(load, []);

  const edit = () => {
    setForm(account ? {
      accountHolderName: account.accountHolderName || "", accountNumber: account.accountNumber || "",
      ifsc: account.ifsc || "", bankName: account.bankName || "", upiId: account.upiId || "",
    } : EMPTY);
    setOpen(true);
  };

  const valid = form.accountHolderName.trim() && ((form.accountNumber && form.ifsc) || form.upiId);

  const save = async () => {
    setBusy(true);
    try {
      const saved = await paymentApi.saveMyBankAccount({
        accountHolderName: form.accountHolderName.trim(),
        accountNumber: form.accountNumber.trim() || null,
        ifsc: form.ifsc.trim().toUpperCase() || null,
        bankName: form.bankName.trim() || null,
        upiId: form.upiId.trim() || null,
      });
      setAccount(saved);
      setOpen(false);
      setToast({ severity: "success", text: "Refund account saved." });
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not save the account") });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await paymentApi.deleteMyBankAccount();
      setAccount(null);
      setToast({ severity: "success", text: "Refund account removed." });
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not remove the account") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-xl text-center py-7 font-semibold">Refund account</h1>
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 560 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Used only when we refund a cash-on-delivery order. Online payments are refunded to the card or UPI app you paid with.
            Your details are encrypted and visible only to you and the platform finance team.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {account === undefined && !error && <CircularProgress size={24} />}
          {account === null && (
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="body2">No refund account saved yet.</Typography>
              <Button variant="contained" onClick={edit}>Add account</Button>
            </Stack>
          )}
          {account && (
            <Stack spacing={1}>
              <Row label="Account holder" value={account.accountHolderName} />
              {account.accountNumber && <Row label="Account number" value={account.accountNumber} />}
              {account.ifsc && <Row label="IFSC" value={account.ifsc} />}
              {account.bankName && <Row label="Bank" value={account.bankName} />}
              {account.upiId && <Row label="UPI id" value={account.upiId} />}
              <Typography variant="caption" color="text.secondary">Updated {fmt(account.updatedAt)}</Typography>
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                <Button variant="outlined" onClick={edit} disabled={busy}>Edit</Button>
                <Button color="error" onClick={remove} disabled={busy}>Remove</Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={busy ? undefined : () => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Refund account</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary">
            Give an account number with IFSC, or a UPI id, or both.
          </Typography>
          <TextField fullWidth margin="dense" label="Account holder name" value={form.accountHolderName}
            onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
            <TextField fullWidth margin="dense" label="Account number" value={form.accountNumber} inputProps={{ inputMode: "numeric" }}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
            <TextField fullWidth margin="dense" label="IFSC" value={form.ifsc}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })} />
          </div>
          <TextField fullWidth margin="dense" label="Bank name (optional)" value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          <TextField fullWidth margin="dense" label="UPI id" placeholder="name@bank" value={form.upiId}
            onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={busy || !valid}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
