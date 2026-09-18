import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import StatusChip from "../common/StatusChip";
import { formatDateTime } from "../common/format";

/** Full application with approve / reject actions for entitled roles. */
export default function ApplicationDialog({ application, canReview, onClose, onChanged, onError }) {
  const navigate = useNavigate();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  if (!application) return null;
  const a = application;
  const pending = a.status === "PENDING";
  const bank = a.bankAccount;

  const close = () => {
    setRejecting(false);
    setReason("");
    onClose();
  };

  const approve = async () => {
    setBusy(true);
    try {
      const updated = await teamApi.approveApplication(a.id);
      onChanged(updated, `${updated.restaurantName} approved. The owner has been emailed.`);
    } catch (err) {
      onError(getErrorMessage(err, "Could not approve the application"));
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      const updated = await teamApi.rejectApplication(a.id, reason.trim());
      setRejecting(false);
      setReason("");
      onChanged(updated, `${updated.restaurantName} rejected. The applicant has been emailed.`);
    } catch (err) {
      onError(getErrorMessage(err, "Could not reject the application"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onClose={busy ? undefined : close} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <span>{a.restaurantName}</span>
          <StatusChip value={a.status} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Applicant">
            <Row label="Name" value={a.applicantName} />
            <Row label="Email" value={a.applicantEmail} />
            <Row label="Phone" value={a.applicantPhone} />
            <Row label="Submitted" value={formatDateTime(a.submittedAt)} />
          </Section>

          <Section title="Restaurant">
            <Row label="Cuisine" value={a.cuisineType} />
            <Row label="Hours" value={a.openingHours} />
            <Row label="Email" value={a.contact?.email} />
            <Row label="Phone" value={a.contact?.mobile} />
            <Row label="Instagram" value={a.contact?.instagram} />
            <Row label="Twitter" value={a.contact?.twitter} />
          </Section>

          <Section title="Address">
            <Typography variant="body2">
              {[a.streetAddress, a.city, a.state, a.pincode, a.country].filter(Boolean).join(", ")}
            </Typography>
          </Section>

          <Section title="Payout account">
            {bank ? (
              <>
                <Row label="Holder" value={bank.accountHolderName} />
                <Row label="Bank" value={bank.bankName} />
                <Row label="Account" value={bank.accountNumber} />
                <Row label="IFSC" value={bank.ifsc} />
                <Row label="UPI" value={bank.upiId} />
                {bank.masked && (
                  <Typography variant="caption" color="text.secondary">
                    Account details are masked for your role.
                  </Typography>
                )}
              </>
            ) : <Typography variant="body2" color="text.secondary">Not provided.</Typography>}
          </Section>
        </div>

        {a.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{a.description}</Typography>
          </>
        )}

        {a.images?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Photos</Typography>
            <div className="flex flex-wrap gap-2">
              {a.images.map((url) => <img key={url} src={url} alt="" className="w-28 h-28 object-cover rounded-md" />)}
            </div>
          </>
        )}

        {a.status !== "PENDING" && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {a.status.charAt(0) + a.status.slice(1).toLowerCase()} on {formatDateTime(a.reviewedAt)} by {a.reviewedBy}
              {a.rejectionReason && <> · Reason: {a.rejectionReason}</>}
            </Typography>
          </>
        )}

        {rejecting && (
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            multiline
            minRows={2}
            autoFocus
            label="Reason for rejection (sent to the applicant)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}
        {pending && !canReview && (
          <Alert severity="info" sx={{ mt: 2 }}>Your role can view applications but not decide on them.</Alert>
        )}
      </DialogContent>
      <DialogActions>
        {a.status === "APPROVED" && a.restaurantId && (
          <Button onClick={() => { close(); navigate(`/team/restaurants/${a.restaurantId}`); }}>Open restaurant</Button>
        )}
        <Button onClick={close} disabled={busy}>Close</Button>
        {pending && canReview && !rejecting && (
          <>
            <Button color="error" onClick={() => setRejecting(true)} disabled={busy}>Reject…</Button>
            <Button variant="contained" color="success" onClick={approve} disabled={busy}>Approve</Button>
          </>
        )}
        {pending && canReview && rejecting && (
          <>
            <Button onClick={() => setRejecting(false)} disabled={busy}>Back</Button>
            <Button variant="contained" color="error" onClick={reject} disabled={busy || !reason.trim()}>Confirm rejection</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>{title}</Typography>
      <Stack spacing={0.5}>{children}</Stack>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
