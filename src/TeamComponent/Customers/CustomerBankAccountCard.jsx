import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { formatDateTime } from "../common/format";

/**
 * Customer's saved refund account for TEAM_ADMIN / TEAM_MANAGER. Details are fetched only on
 * request because every view is recorded in the sensitive-data access log.
 */
export default function CustomerBankAccountCard({ customerId }) {
  const [state, setState] = useState("idle"); // idle | loading | ok | missing | error
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const reveal = () => {
    setState("loading");
    teamApi.customerBankAccount(customerId)
      .then((a) => { setAccount(a); setState("ok"); })
      .catch((err) => {
        if (err?.response?.status === 404) setState("missing");
        else { setError(getErrorMessage(err, "Could not load the refund account")); setState("error"); }
      });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary">Refund account</Typography>
        {state === "idle" && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
              Saved destination for cash-on-delivery refunds. Viewing it is logged.
            </Typography>
            <Button size="small" variant="outlined" onClick={reveal}>Reveal</Button>
          </>
        )}
        {state === "loading" && <CircularProgress size={20} sx={{ display: "block", mt: 1 }} />}
        {state === "missing" && <Typography variant="body2" sx={{ mt: 1 }}>No refund account saved.</Typography>}
        {state === "error" && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {state === "ok" && account && (
          <>
            <Typography variant="body1" sx={{ mt: 1 }}>{account.accountHolderName}</Typography>
            {account.accountNumber && (
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{account.accountNumber} · {account.ifsc}</Typography>
            )}
            {account.bankName && <Typography variant="body2" color="text.secondary">{account.bankName}</Typography>}
            {account.upiId && <Typography variant="body2" color="text.secondary">UPI: {account.upiId}</Typography>}
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Updated {formatDateTime(account.updatedAt)}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
