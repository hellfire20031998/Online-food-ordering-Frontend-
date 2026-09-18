import {
  Alert, Button, Card, CardContent, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { formatDateTime, humanize } from "../common/format";

/** Encryption key status, re-encryption after a key rotation, and who viewed unmasked bank details. TEAM_ADMIN only. */
export default function SecuritySection({ onToast }) {
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    Promise.all([teamApi.encryptionStatus(), teamApi.accessLog({ size: 20 })])
      .then(([s, l]) => { setStatus(s); setLog(l); })
      .catch((err) => setError(getErrorMessage(err, "Could not load security status")));
  }, []);

  useEffect(load, [load]);

  const rotate = async () => {
    setBusy(true);
    try {
      const report = await teamApi.rotateEncryption();
      const total = Object.values(report.reencrypted || {}).reduce((a, b) => a + b, 0);
      onToast({ severity: "success", text: total === 0 ? "All data is already on the current key." : `${total} values re-encrypted with the current key.` });
      load();
    } catch (err) {
      onToast({ severity: "error", text: getErrorMessage(err, "Re-encryption failed") });
    } finally {
      setBusy(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!status || !log) return <CircularProgress size={24} />;

  const stale = Object.entries(status.rowsNotOnCurrentKey || {});

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>Data encryption</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bank account numbers and UPI ids are encrypted at rest with AES-256-GCM. Card data is never stored; the payment gateway holds it.
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            <Chip label={`Current key ${status.currentKeyFingerprint}`} variant="outlined" />
            <Chip label={`${status.previousKeys} previous key${status.previousKeys === 1 ? "" : "s"} configured`} variant="outlined" />
            <Chip label={status.strongKey ? "Key strength OK" : "Weak or default key"} color={status.strongKey ? "success" : "error"} />
          </Stack>
          {stale.length > 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {stale.map(([col, n]) => `${n} in ${col}`).join(", ")} still encrypted with an older key.
            </Alert>
          ) : (
            <Typography variant="body2" sx={{ mb: 2 }}>All encrypted data is on the current key.</Typography>
          )}
          <Button variant="outlined" onClick={rotate} disabled={busy}>Re-encrypt with current key</Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            To rotate: move DATA_ENCRYPTION_KEY into DATA_ENCRYPTION_PREVIOUS_KEYS, set a new key, restart, then run this.
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Sensitive data access log</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Every time a team member views unmasked bank details. {log.totalElements} entries in total.
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Who</TableCell>
                <TableCell>What</TableCell>
                <TableCell>Record</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.content.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{formatDateTime(e.accessedAt)}</TableCell>
                  <TableCell>{e.actorEmail}</TableCell>
                  <TableCell>{humanize(e.subjectType)}</TableCell>
                  <TableCell>#{e.subjectId}</TableCell>
                </TableRow>
              ))}
              {log.content.length === 0 && (
                <TableRow><TableCell colSpan={4}><Typography variant="body2" color="text.secondary">No access recorded yet.</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
