export const formatMoney = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 })
    .format(Number(value || 0));

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

export const humanize = (value) =>
  value ? String(value).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
