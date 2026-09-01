import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, getErrorMessage } from "../../component/config/api";
import { useSelector } from "react-redux";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: ""
};

// Note: this page is not currently routed anywhere; it is kept for the
// staff-role assignment flow (MEMBER/MANAGER) if it gets re-enabled.
const AssignRolePage = () => {
  const [message, setMessage] = useState(null);
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation();

  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);

  useEffect(() => {
    api.get("auth/restaurant/roles")
      .then(res => setRoles(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRoles([]));
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const { fullName, email, password, role } = values;
    try {
      // 1. Create the user
      const userRes = await api.post("auth/signup", {
        fullName,
        email,
        password,
        role
      });

      const userId = userRes.data.id;

      // 2. Assign role using query parameters
      await api.post("restaurant-roles/assign", null, {
        params: {
          userId,
          restaurantId,
          role,
        },
      });

      setMessage({ severity: "success", text: "User created and role assigned successfully!" });
      resetForm();
    } catch (error) {
      setMessage({ severity: "error", text: getErrorMessage(error, "Failed to assign role.") });
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {t("assign_role_to_restaurant")}
      </Typography>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Field
              as={TextField}
              name="fullName"
              label={t("fullName")}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Field
              as={TextField}
              name="email"
              label={t("email")}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Field
              as={TextField}
              name="password"
              label={t("password")}
              fullWidth
              variant="outlined"
              margin="normal"
              type="password"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">{t("role")}</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={values.role}
                label={t("role")}
                onChange={(e) => setFieldValue("role", e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              sx={{ mt: 2, py: 1 }}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              {t("create_and_assign")}
            </Button>
          </Form>
        )}
      </Formik>

      {message && (
        <Alert severity={message.severity} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
    </div>
  );
};

export default AssignRolePage;
