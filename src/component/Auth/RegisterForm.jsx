import { Alert, Button, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from "../State/Authentication/Action";

const initialValues = {
  fullName: "",
  email: "",
  password: ""
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

// Public signup is customer-only. Restaurant owners go through the
// team-approved application flow; platform team members are created by a team admin.
const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(store => store.auth.error);
  const isLoading = useSelector(store => store.auth.isLoading);

  const handleSubmit = (values) => {
    dispatch(registerUser({ userData: values, navigate }));
  };

  return (
    <div>
      <Typography variant="h5" className="text-center">
        Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {typeof error === "string" ? error : "Registration failed"}
        </Alert>
      )}

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        <Form>
          <Field
            as={TextField}
            name="fullName"
            label="Full Name"
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
          <Field
            as={TextField}
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          <Field
            as={TextField}
            name="password"
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

          <Button
            sx={{ mt: 2, padding: "1rem" }}
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Register
          </Button>
        </Form>
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account?
        <Button size="small" onClick={() => navigate("/account/login")}>
          Login
        </Button>
      </Typography>
    </div>
  );
};

export default RegisterForm;
