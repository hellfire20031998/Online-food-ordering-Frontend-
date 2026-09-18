import { TextField } from "@mui/material";
import React from "react";

/**
 * Payout account inputs shared by the partner application and the owner's edit dialog.
 * `values` / `errors` / `touched` follow Formik's shape; `prefix` nests the fields (e.g. "bankAccount").
 */
export default function BankAccountFields({ values, errors = {}, touched = {}, handleChange, handleBlur, prefix = "" }) {
  const name = (f) => (prefix ? `${prefix}.${f}` : f);
  const field = (f, label, props = {}) => (
    <TextField
      fullWidth
      margin="dense"
      name={name(f)}
      label={label}
      value={values[f] ?? ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(touched[f] && errors[f])}
      helperText={touched[f] && errors[f]}
      {...props}
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      {field("accountHolderName", "Account holder name")}
      {field("bankName", "Bank name")}
      {field("accountNumber", "Account number", { inputProps: { inputMode: "numeric" } })}
      {field("ifsc", "IFSC code", { inputProps: { style: { textTransform: "uppercase" } } })}
      {field("upiId", "UPI ID (optional)", { placeholder: "name@bank" })}
    </div>
  );
}

export const bankAccountInitialValues = {
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  upiId: "",
};
