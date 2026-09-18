import * as Yup from "yup";

export const bankAccountSchema = Yup.object({
  accountHolderName: Yup.string().trim().required("Account holder name is required"),
  bankName: Yup.string().trim().required("Bank name is required"),
  accountNumber: Yup.string()
    .matches(/^\d{9,18}$/, "Account number must be 9 to 18 digits")
    .required("Account number is required"),
  ifsc: Yup.string()
    .transform((v) => (v ? v.toUpperCase() : v))
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code")
    .required("IFSC code is required"),
  upiId: Yup.string()
    .trim()
    .matches(/^[\w.-]{2,256}@[A-Za-z]{2,64}$/, "UPI ID should look like name@bank")
    .notRequired()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
});
