import { Chip } from "@mui/material";
import React from "react";
import { humanize } from "./format";

const COLORS = {
  ACTIVE: "success",
  SUSPENDED: "error",
  BLOCKED: "error",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
  WITHDRAWN: "default",
  OUT_FOR_DELIVERY: "info",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "default",
  PAYMENT_PENDING: "warning",
  PAYMENT_FAILED: "error",
  PAID: "success",
  FAILED: "error",
  PARTIALLY_REFUNDED: "info",
  REFUNDED: "info",
  REQUESTED: "warning",
  PROCESSING: "info",
};

export default function StatusChip({ value, size = "small" }) {
  if (!value) return null;
  return <Chip size={size} label={humanize(value)} color={COLORS[value] || "default"} variant="outlined" />;
}
