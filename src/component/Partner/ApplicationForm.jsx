import { AddPhotoAlternate } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Button, CircularProgress, Divider, IconButton, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { uploadImageToCloudinary } from "../../AdminComponent/util/CreateUploadToCloudinary";
import { getErrorMessage } from "../config/api";
import BankAccountFields, { bankAccountInitialValues } from "./BankAccountFields";
import { bankAccountSchema } from "./bankAccountSchema";
import { partnerApi } from "./partnerApi";

const initialValues = {
  restaurantName: "",
  description: "",
  cuisineType: "",
  openingHours: "Mon-Sun : 9:00AM - 9:00PM",
  applicantPhone: "",
  address: { streetAddress: "", city: "", state: "", pincode: "", country: "India" },
  contact: { email: "", mobile: "", instagram: "", twitter: "" },
  images: [],
  bankAccount: { ...bankAccountInitialValues },
};

const schema = Yup.object({
  restaurantName: Yup.string().trim().required("Restaurant name is required"),
  description: Yup.string().max(1000, "Keep the description under 1000 characters"),
  cuisineType: Yup.string().trim().required("Cuisine type is required"),
  applicantPhone: Yup.string().trim(),
  address: Yup.object({
    streetAddress: Yup.string().trim().required("Street address is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    pincode: Yup.string().trim().required("Pincode is required"),
    country: Yup.string().trim().required("Country is required"),
  }),
  contact: Yup.object({
    email: Yup.string().email("Enter a valid email").required("Restaurant email is required"),
    mobile: Yup.string().trim().required("Restaurant phone is required"),
  }),
  bankAccount: bankAccountSchema,
});

export default function ApplicationForm({ user, onSubmitted }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: { ...initialValues, contact: { ...initialValues.contact, email: user?.email || "" } },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const created = await partnerApi.submit({
          ...values,
          bankAccount: { ...values.bankAccount, ifsc: values.bankAccount.ifsc.toUpperCase(), upiId: values.bankAccount.upiId || null },
        });
        onSubmitted?.(created);
      } catch (err) {
        setError(getErrorMessage(err, "Could not submit the application"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting } = formik;
  const nested = (group, f) => ({
    name: `${group}.${f}`,
    value: values[group][f] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
    error: Boolean(touched[group]?.[f] && errors[group]?.[f]),
    helperText: touched[group]?.[f] && errors[group]?.[f],
  });
  const flat = (f) => ({
    name: f, value: values[f] ?? "", onChange: handleChange, onBlur: handleBlur,
    error: Boolean(touched[f] && errors[f]), helperText: touched[f] && errors[f],
  });

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFieldValue("images", [...values.images, url]);
    } catch (err) {
      setError("Image upload failed. You can submit without photos and add them later.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && <Alert severity="error">{error}</Alert>}

      <section>
        <Typography variant="h6" gutterBottom>Restaurant</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <TextField fullWidth margin="dense" label="Restaurant name" {...flat("restaurantName")} />
          <TextField fullWidth margin="dense" label="Cuisine type" {...flat("cuisineType")} />
          <TextField fullWidth margin="dense" label="Opening hours" {...flat("openingHours")} />
          <TextField fullWidth margin="dense" label="Your phone number" {...flat("applicantPhone")} />
        </div>
        <TextField fullWidth margin="dense" label="Description" multiline minRows={3} {...flat("description")} />
      </section>

      <section>
        <Typography variant="h6" gutterBottom>Address</Typography>
        <TextField fullWidth margin="dense" label="Street address" {...nested("address", "streetAddress")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4">
          <TextField fullWidth margin="dense" label="City" {...nested("address", "city")} />
          <TextField fullWidth margin="dense" label="State" {...nested("address", "state")} />
          <TextField fullWidth margin="dense" label="Pincode" {...nested("address", "pincode")} />
          <TextField fullWidth margin="dense" label="Country" {...nested("address", "country")} />
        </div>
      </section>

      <section>
        <Typography variant="h6" gutterBottom>Contact</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <TextField fullWidth margin="dense" label="Restaurant email" {...nested("contact", "email")} />
          <TextField fullWidth margin="dense" label="Restaurant phone" {...nested("contact", "mobile")} />
          <TextField fullWidth margin="dense" label="Instagram (optional)" {...nested("contact", "instagram")} />
          <TextField fullWidth margin="dense" label="Twitter / X (optional)" {...nested("contact", "twitter")} />
        </div>
      </section>

      <section>
        <Typography variant="h6" gutterBottom>Photos (optional)</Typography>
        <div className="flex flex-wrap gap-3 items-center">
          <input type="file" accept="image/*" id="partner-photo" style={{ display: "none" }} onChange={handleImage} />
          <label htmlFor="partner-photo" className="relative">
            <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md border-gray-600">
              {uploading ? <CircularProgress size={24} /> : <AddPhotoAlternate />}
            </span>
          </label>
          {values.images.map((url, i) => (
            <div className="relative" key={url}>
              <img className="w-24 h-24 object-cover rounded-md" src={url} alt="" />
              <IconButton size="small" sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => setFieldValue("images", values.images.filter((_, idx) => idx !== i))}>
                <CloseIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <Typography variant="h6">Payout account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Where we will transfer your earnings. Stored encrypted and visible only to you and the platform finance team.
        </Typography>
        <BankAccountFields
          prefix="bankAccount"
          values={values.bankAccount}
          errors={errors.bankAccount || {}}
          touched={touched.bankAccount || {}}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </section>

      <Button type="submit" variant="contained" size="large" disabled={isSubmitting || uploading}>
        Submit application
      </Button>
    </form>
  );
}
