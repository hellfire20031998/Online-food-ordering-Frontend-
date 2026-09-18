import {
  Alert, Button, Card, CardContent, CircularProgress, InputAdornment, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { canManagePlatform, isTeamAdmin } from "../../component/config/roles";
import PageHeader from "../common/PageHeader";
import { formatDateTime } from "../common/format";
import SecuritySection from "./SecuritySection";

export default function Settings() {
  const role = useSelector(store => store.auth.user?.role);
  const canManage = canManagePlatform(role);

  const [settings, setSettings] = useState(null);
  const [commission, setCommission] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    teamApi.settings()
      .then((s) => { setSettings(s); setCommission(String(s.commissionPercentage)); })
      .catch((err) => setError(getErrorMessage(err, "Could not load settings")));
  }, []);

  const save = async () => {
    const value = Number(commission);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setToast({ severity: "error", text: "Commission must be between 0 and 100." });
      return;
    }
    setSaving(true);
    try {
      const updated = await teamApi.updateSettings(value);
      setSettings(updated);
      setCommission(String(updated.commissionPercentage));
      setToast({ severity: "success", text: `Commission set to ${updated.commissionPercentage}%.` });
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not save settings") });
    } finally {
      setSaving(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!settings) return <CircularProgress />;

  const dirty = String(settings.commissionPercentage) !== commission;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Platform-wide defaults" />

      <Card variant="outlined" sx={{ maxWidth: 560 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>Commission</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Default percentage the platform keeps from every order. Applies to all restaurants;
            per-restaurant overrides come with the payout ledger.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              label="Commission"
              type="number"
              size="small"
              value={commission}
              disabled={!canManage}
              onChange={(e) => setCommission(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.5 }}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
            <TextField label="Currency" size="small" value={settings.currency} disabled />
            {canManage && (
              <Button variant="contained" onClick={save} disabled={saving || !dirty}>Save</Button>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Last changed {formatDateTime(settings.updatedAt)} by {settings.updatedBy || "system"}
            {!canManage && " · Only team admins and managers can change this."}
          </Typography>
        </CardContent>
      </Card>

      {isTeamAdmin(role) && (
        <div className="mt-6 max-w-3xl">
          <Typography variant="h6" gutterBottom>Security</Typography>
          <SecuritySection onToast={setToast} />
        </div>
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
