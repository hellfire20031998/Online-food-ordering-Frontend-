import {
  Alert, Button, Card, CardContent, Chip, CircularProgress, Snackbar, Stack, Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../State/Authentication/Action";
import { getErrorMessage } from "../config/api";
import { isTeamRole } from "../config/roles";
import { hasTokenAuthority } from "../config/session";
import ApplicationForm from "./ApplicationForm";
import { partnerApi } from "./partnerApi";

const fmt = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

/** /partner: apply to list a restaurant, or see the status of an existing application. */
export default function PartnerApplication() {
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [apps, setApps] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    partnerApi.myApplications()
      .then(setApps)
      .catch((err) => setError(getErrorMessage(err, "Could not load your application")));
  }, []);

  useEffect(() => {
    if (user && !isTeamRole(user.role)) load();
  }, [user, load]);

  if (!user) return <Centered><CircularProgress /></Centered>;
  if (isTeamRole(user.role)) return <Navigate to="/team" replace />;

  const signInAgain = () => {
    dispatch(logout());
    navigate("/account/login");
  };

  // Approved owners: either their token is still the old CUSTOMER one, or they already run a restaurant.
  if (user.role === "ADMIN") {
    const stale = !hasTokenAuthority("ADMIN");
    return (
      <Centered>
        <Card variant="outlined" sx={{ maxWidth: 520 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>{stale ? "Your application was approved" : "You already run a restaurant"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {stale
                ? "Your account now has restaurant owner access. Sign in again to pick up the new permissions and open your dashboard."
                : "Manage your menu, orders and payout account from the restaurant dashboard."}
            </Typography>
            {stale
              ? <Button variant="contained" onClick={signInAgain}>Sign in again</Button>
              : <Button variant="contained" onClick={() => navigate("/admin/restaurant")}>Open dashboard</Button>}
          </CardContent>
        </Card>
      </Centered>
    );
  }

  if (error) return <Centered><Alert severity="error">{error}</Alert></Centered>;
  if (!apps) return <Centered><CircularProgress /></Centered>;

  const latest = apps[0];

  const withdraw = async () => {
    setBusy(true);
    try {
      await partnerApi.withdraw(latest.id);
      setToast({ severity: "success", text: "Application withdrawn." });
      load();
    } catch (err) {
      setToast({ severity: "error", text: getErrorMessage(err, "Could not withdraw the application") });
    } finally {
      setBusy(false);
    }
  };

  if (latest?.status === "PENDING") {
    return (
      <Centered>
        <Card variant="outlined" sx={{ maxWidth: 560, width: "100%" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5">{latest.restaurantName}</Typography>
              <Chip label="Under review" color="warning" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Submitted {fmt(latest.submittedAt)}. Our team usually responds within a few business days; we will email {user.email} with the decision.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Payout account on file: {latest.bankAccount?.bankName} · {latest.bankAccount?.accountNumber}
            </Typography>
            <Button sx={{ mt: 3 }} color="error" onClick={withdraw} disabled={busy}>Withdraw application</Button>
          </CardContent>
        </Card>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </Centered>
    );
  }

  return (
    <div className="px-5 lg:px-20 py-10 max-w-5xl mx-auto">
      <Typography variant="h4" fontWeight={600} gutterBottom>Partner with Foodiyapa</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Tell us about your restaurant. Once the platform team approves your application you will get owner access to manage your menu and orders.
      </Typography>

      {latest?.status === "REJECTED" && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your previous application for <strong>{latest.restaurantName}</strong> was not approved on {fmt(latest.reviewedAt)}.
          {latest.rejectionReason && <> Reason: {latest.rejectionReason}</>} You can address this and apply again below.
        </Alert>
      )}
      {latest?.status === "WITHDRAWN" && (
        <Alert severity="info" sx={{ mb: 3 }}>You withdrew your previous application. You can submit a new one below.</Alert>
      )}

      <ApplicationForm
        user={user}
        onSubmitted={() => {
          setToast({ severity: "success", text: "Application submitted. We have emailed you a confirmation." });
          load();
        }}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Centered({ children }) {
  return <div className="flex justify-center px-5 py-16">{children}</div>;
}

function Toast({ toast, onClose }) {
  return (
    <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={onClose}>
      {toast ? <Alert severity={toast.severity} onClose={onClose}>{toast.text}</Alert> : undefined}
    </Snackbar>
  );
}
