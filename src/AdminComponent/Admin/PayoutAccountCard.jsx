import {
  Alert, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Typography
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import BankAccountFields, { bankAccountInitialValues } from "../../component/Partner/BankAccountFields";
import { bankAccountSchema } from "../../component/Partner/bankAccountSchema";
import { ownerApi } from "../../component/Partner/partnerApi";
import { getErrorMessage } from "../../component/config/api";

const fmt = (v) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—");

/** Owner-side payout account: shown unmasked to the owner, editable. */
export default function PayoutAccountCard({ restaurantId }) {
  const [account, setAccount] = useState(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    setError(null);
    ownerApi.bankAccount(restaurantId)
      .then((a) => { setAccount(a); setMissing(false); })
      .catch((err) => {
        if (err?.response?.status === 404) setMissing(true);
        else setError(getErrorMessage(err, "Could not load the payout account"));
      });
  }, [restaurantId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: account
      ? { accountHolderName: account.accountHolderName || "", bankName: account.bankName || "",
          accountNumber: account.accountNumber || "", ifsc: account.ifsc || "", upiId: account.upiId || "" }
      : { ...bankAccountInitialValues },
    validationSchema: bankAccountSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const saved = await ownerApi.saveBankAccount(restaurantId, {
          ...values, ifsc: values.ifsc.toUpperCase(), upiId: values.upiId || null,
        });
        setAccount(saved);
        setMissing(false);
        setOpen(false);
        setToast({ severity: "success", text: "Payout account saved." });
      } catch (err) {
        setToast({ severity: "error", text: getErrorMessage(err, "Could not save the payout account") });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader
        title={<span className="text-gray-300">Payout account</span>}
        action={<Button size="small" onClick={() => setOpen(true)}>{account ? "Edit" : "Add"}</Button>}
      />
      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}
        {missing && !error && (
          <Typography variant="body2" color="text.secondary">
            No payout account on file. Add one so the platform can transfer your earnings.
          </Typography>
        )}
        {account && (
          <div className="space-y-3 text-gray-200">
            <Row label="Account holder" value={account.accountHolderName} />
            <Row label="Bank" value={account.bankName} />
            <Row label="Account number" value={account.accountNumber} />
            <Row label="IFSC" value={account.ifsc} />
            <Row label="UPI ID" value={account.upiId || "—"} />
            <Typography variant="caption" color="text.secondary">
              Last updated {fmt(account.updatedAt)} by {account.updatedBy}
            </Typography>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onClose={formik.isSubmitting ? undefined : () => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Payout account</DialogTitle>
          <DialogContent>
            <BankAccountFields
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={formik.isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1">
      <p className="sm:w-40 flex-none text-gray-400 text-sm sm:text-base">{label}</p>
      <p className="text-gray-200 break-all">{value}</p>
    </div>
  );
}
