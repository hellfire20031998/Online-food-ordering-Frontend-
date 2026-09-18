import { api } from "../config/api";

const data = (promise) => promise.then((res) => res.data);

export const paymentApi = {
  config: () => data(api.get("api/payments/config")),
  forOrder: (orderId) => data(api.get(`api/payments/order/${orderId}`)),
  confirm: (paymentId) => data(api.post(`api/payments/${paymentId}/confirm`)),
  requestRefund: (orderId, body) => data(api.post(`api/orders/${orderId}/refunds`, body)),
  refundsForOrder: (orderId) => data(api.get(`api/orders/${orderId}/refunds`)),

  // Saved refund destination (cash-on-delivery refunds). GET returns null when none is saved.
  myBankAccount: () => api.get("api/users/me/bank-account").then((res) => (res.status === 204 ? null : res.data)),
  saveMyBankAccount: (body) => data(api.put("api/users/me/bank-account", body)),
  deleteMyBankAccount: () => api.delete("api/users/me/bank-account"),
};

export const PAYMENT_METHOD_LABELS = {
  CASH_ON_DELIVERY: "Cash on delivery",
  CREDIT_CARD: "Credit card",
  DEBIT_CARD: "Debit card",
  NET_BANKING: "Net banking",
  UPI: "UPI",
  WALLET: "Wallet",
};

export const paymentStatusLabel = (payment) => {
  if (!payment) return null;
  if (payment.hasOpenRefund) return { text: "Refund in progress", color: "warning" };
  switch (payment.status) {
    case "PAID": return { text: "Paid", color: "success" };
    case "PENDING": return payment.provider === "CASH_ON_DELIVERY"
      ? { text: "Pay on delivery", color: "default" }
      : { text: "Awaiting payment", color: "warning" };
    case "FAILED": return { text: "Payment failed", color: "error" };
    case "CANCELLED": return { text: "Payment cancelled", color: "default" };
    case "PARTIALLY_REFUNDED": return { text: "Partially refunded", color: "info" };
    case "REFUNDED": return { text: "Refunded", color: "info" };
    default: return { text: payment.status, color: "default" };
  }
};
