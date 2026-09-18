import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { formatDateTime } from "../common/format";

/** Team-side payout account view. Only rendered for TEAM_ADMIN / TEAM_MANAGER. */
export default function BankAccountCard({ restaurantId }) {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | missing | error
  const [error, setError] = useState(null);

  useEffect(() => {
    setState("loading");
    teamApi.restaurantBankAccount(restaurantId)
      .then((a) => { setAccount(a); setState("ok"); })
      .catch((err) => {
        if (err?.response?.status === 404) setState("missing");
        else { setError(getErrorMessage(err, "Could not load the payout account")); setState("error"); }
      });
  }, [restaurantId]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary">Payout account</Typography>
        {state === "loading" && <CircularProgress size={20} sx={{ display: "block", mt: 1 }} />}
        {state === "missing" && <Typography variant="body2" sx={{ mt: 1 }}>No payout account on file.</Typography>}
        {state === "error" && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {state === "ok" && account && (
          <>
            <Typography variant="body1" sx={{ mt: 1 }}>{account.accountHolderName}</Typography>
            <Typography variant="body2" color="text.secondary">{account.bankName} · {account.ifsc}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace" }}>{account.accountNumber}</Typography>
            {account.upiId && <Typography variant="body2" color="text.secondary">UPI: {account.upiId}</Typography>}
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Updated {formatDateTime(account.updatedAt)} by {account.updatedBy}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
