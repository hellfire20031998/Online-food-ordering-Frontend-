import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from "../State/Authentication/Action";
import { api } from "../config/api";
import { useTranslation } from "react-i18next";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: ""
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: Yup.string().required("Role is required")
});

// GET /auth/roles returns ["CUSTOMER", "ADMIN"]; show friendly labels.
const ROLE_LABELS = {
  CUSTOMER: "Customer",
  ADMIN: "Restaurant Owner"
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation();
  const error = useSelector(store => store.auth.error);
  const isLoading = useSelector(store => store.auth.isLoading);

  useEffect(() => {
    api.get("auth/roles")
      .then((res) => setRoles(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRoles(["CUSTOMER", "ADMIN"]));
  }, []);

  const handleSubmit = (values) => {
    dispatch(registerUser({ userData: values, navigate }));
  };

  return (
    <div>
      <Typography variant="h5" className="text-center">
        {t("register")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {typeof error === "string" ? error : t("registration_failed")}
        </Alert>
      )}

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <Field
              as={TextField}
              name="fullName"
              label={t("fullName")}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
            <Field
              as={TextField}
              name="email"
              label={t("email")}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            <Field
              as={TextField}
              name="password"
              label={t("password")}
              fullWidth
              variant="outlined"
              margin="normal"
              type="password"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            <FormControl fullWidth margin="normal" error={touched.role && Boolean(errors.role)}>
              <InputLabel id="role-simple-select-label">{t("role")}</InputLabel>
              <Select
                labelId="role-simple-select-label"
                id="role-simple-select"
                label={t("role")}
                name="role"
                value={values.role}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {ROLE_LABELS[role] || role}
                  </MenuItem>
                ))}
              </Select>
              {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            <Button
              sx={{ mt: 2, padding: "1rem" }}
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {t("register")}
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        {t("already_have_account")}
        <Button size="small" onClick={() => navigate("/account/login")}>
          {t("login")}
        </Button>
      </Typography>
    </div>
  );
};

export default RegisterForm;
