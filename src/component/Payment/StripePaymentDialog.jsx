import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useMemo, useState } from "react";
import { getErrorMessage } from "../config/api";
import { paymentApi } from "./paymentApi";

const stripeCache = new Map();
const stripeFor = (key) => {
  if (!stripeCache.has(key)) stripeCache.set(key, loadStripe(key));
  return stripeCache.get(key);
};

/**
 * Completes an online payment for an order that is awaiting payment.
 * Props: publishableKey, payment ({ id, clientSecret, amount, currency }), onSuccess(payment), onClose().
 */
export default function StripePaymentDialog({ publishableKey, payment, onSuccess, onClose }) {
  const stripePromise = useMemo(() => (publishableKey ? stripeFor(publishableKey) : null), [publishableKey]);

  if (!payment?.clientSecret || !stripePromise) return null;

  const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: payment.currency || "INR" })
    .format(Number(payment.amount || 0));

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Pay {amount}</DialogTitle>
      <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret, appearance: { theme: "night" } }}>
        <CheckoutForm paymentId={payment.id} onSuccess={onSuccess} onClose={onClose} />
      </Elements>
    </Dialog>
  );
}

function CheckoutForm({ paymentId, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: `${window.location.origin}/my-profile/orders` },
      });
      if (stripeError) {
        setError(stripeError.message || "Payment was not completed.");
        return;
      }
      // Ask our server to verify with the gateway and settle the order.
      const confirmed = await paymentApi.confirm(paymentId);
      if (confirmed.status === "PAID") {
        onSuccess(confirmed);
      } else if (confirmed.status === "FAILED") {
        setError(confirmed.failureReason || "Payment failed. Please try another method.");
      } else {
        // e.g. bank transfer still processing; the order updates when the gateway confirms.
        onSuccess(confirmed);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not confirm the payment"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <PaymentElement />
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          Payments are processed securely by Stripe. You can also pay later from My Orders.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Pay later</Button>
        <Button variant="contained" onClick={pay} disabled={busy || !stripe || !elements}>
          {busy ? "Processing…" : "Pay now"}
        </Button>
      </DialogActions>
    </>
  );
}
