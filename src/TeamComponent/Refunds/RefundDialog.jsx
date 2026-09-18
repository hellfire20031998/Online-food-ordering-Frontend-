import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import StatusChip from "../common/StatusChip";
import { formatDateTime, formatMoney, humanize } from "../common/format";

/** Refund detail with approve / complete / reject for admins and managers. */
export default function RefundDialog({ refund, canManage, onClose, onChanged, onError }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | reject | complete | bank
  const [text, setText] = useState("");
  const [bank, setBank] = useState({ beneficiaryName: "", accountNumber: "", ifsc: "", upiId: "" });
  const [busy, setBusy] = useState(false);

  if (!refund) return null;
  const r = refund;
  const manual = r.method === "BANK_TRANSFER";
  const needsBank = manual && !r.bankAccount;

  const reset = () => { setMode(null); setText(""); };
  const close = () => { reset(); onClose(); };

  const run = async (fn, message) => {
    setBusy(true);
    try {
      const updated = await fn();
      reset();
      onChanged(updated, message);
    } catch (err) {
      onError(getErrorMessage(err, "Could not update the refund"));
    } finally {
      setBusy(false);
    }
  };

  const approve = () => run(
    () => teamApi.approveRefund(r.id, mode === "bank" ? { bankAccount: {
      beneficiaryName: bank.beneficiaryName, accountNumber: bank.accountNumber || null,
      ifsc: bank.ifsc ? bank.ifsc.toUpperCase() : null, upiId: bank.upiId || null } } : {}),
    manual ? "Refund approved. Make the transfer, then record its reference." : "Refund sent to the payment gateway.");
  const complete = () => run(() => teamApi.completeRefund(r.id, { referenceNumber: text.trim() }), "Refund marked as completed. The customer has been emailed.");
  const reject = () => run(() => teamApi.rejectRefund(r.id, text.trim()), "Refund rejected. The customer has been emailed.");

  return (
    <Dialog open onClose={busy ? undefined : close} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <span>Refund #{r.id} · {formatMoney(r.amount, r.currency)}</span>
          <StatusChip value={r.status} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={0.75}>
          <Row label="Order" value={<Button size="small" onClick={() => { close(); navigate(`/team/orders`); }}>#{r.orderId}</Button>} />
          <Row label="Customer" value={`${r.customerName || ""} (${r.customerEmail || ""})`} />
          <Row label="Restaurant" value={r.restaurantName} />
          <Row label="Method" value={humanize(r.method)} />
          <Row label="Reason" value={r.reason} />
          <Row label="Requested" value={`${formatDateTime(r.requestedAt)} by ${r.requestedByCustomer ? "customer" : r.requestedBy}`} />
          {r.processedAt && <Row label="Processed" value={`${formatDateTime(r.processedAt)} by ${r.processedBy}`} />}
          {r.providerRefundId && <Row label="Gateway ref" value={r.providerRefundId} />}
          {r.referenceNumber && <Row label="Bank ref" value={r.referenceNumber} />}
          {r.rejectionReason && <Row label="Rejected because" value={r.rejectionReason} />}
          {r.notes && <Row label="Notes" value={r.notes} />}
        </Stack>

        {manual && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Refund destination</Typography>
            {r.bankAccount ? (
              <Stack spacing={0.5}>
                <Row label="Beneficiary" value={r.bankAccount.accountHolderName} />
                <Row label="Account" value={r.bankAccount.accountNumber} />
                <Row label="IFSC" value={r.bankAccount.ifsc} />
                <Row label="UPI" value={r.bankAccount.upiId} />
                {r.bankAccount.masked && <Typography variant="caption" color="text.secondary">Masked for your role.</Typography>}
              </Stack>
            ) : (
              <Alert severity="warning">No bank details on file. Add them when approving.</Alert>
            )}
          </>
        )}

        {mode === "bank" && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <TextField size="small" label="Beneficiary name" value={bank.beneficiaryName} onChange={(e) => setBank({ ...bank, beneficiaryName: e.target.value })} />
            <Stack direction="row" spacing={1}>
              <TextField size="small" label="Account number" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} fullWidth />
              <TextField size="small" label="IFSC" value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value })} fullWidth />
            </Stack>
            <TextField size="small" label="UPI id (alternative)" value={bank.upiId} onChange={(e) => setBank({ ...bank, upiId: e.target.value })} />
          </Stack>
        )}
        {mode === "complete" && (
          <TextField sx={{ mt: 2 }} fullWidth autoFocus label="Bank transfer reference (UTR / IMPS / NEFT id)"
            value={text} onChange={(e) => setText(e.target.value)} />
        )}
        {mode === "reject" && (
          <TextField sx={{ mt: 2 }} fullWidth autoFocus multiline minRows={2} label="Reason (sent to the customer)"
            value={text} onChange={(e) => setText(e.target.value)} />
        )}
        {r.status === "PROCESSING" && (
          <Alert severity="info" sx={{ mt: 2 }}>Waiting for the payment gateway to confirm this refund.</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={busy}>Close</Button>
        {canManage && r.status === "REQUESTED" && !mode && (
          <>
            <Button color="error" onClick={() => setMode("reject")} disabled={busy}>Reject…</Button>
            {needsBank
              ? <Button variant="contained" onClick={() => setMode("bank")} disabled={busy}>Add bank details & approve…</Button>
              : <Button variant="contained" color="success" onClick={approve} disabled={busy}>Approve</Button>}
          </>
        )}
        {canManage && r.status === "APPROVED" && manual && !mode && (
          <>
            <Button color="error" onClick={() => setMode("reject")} disabled={busy}>Reject…</Button>
            <Button variant="contained" color="success" onClick={() => setMode("complete")} disabled={busy}>Record transfer…</Button>
          </>
        )}
        {mode === "bank" && (
          <>
            <Button onClick={reset} disabled={busy}>Back</Button>
            <Button variant="contained" color="success" onClick={approve}
              disabled={busy || !bank.beneficiaryName.trim() || !((bank.accountNumber && bank.ifsc) || bank.upiId)}>Approve</Button>
          </>
        )}
        {mode === "complete" && (
          <>
            <Button onClick={reset} disabled={busy}>Back</Button>
            <Button variant="contained" color="success" onClick={complete} disabled={busy || !text.trim()}>Mark completed</Button>
          </>
        )}
        {mode === "reject" && (
          <>
            <Button onClick={reset} disabled={busy}>Back</Button>
            <Button variant="contained" color="error" onClick={reject} disabled={busy || !text.trim()}>Confirm rejection</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

function Row({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
      <Typography variant="body2" component="div">{value}</Typography>
    </Stack>
  );
}
