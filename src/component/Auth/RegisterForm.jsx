import {
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../State/Authentication/Action";
import { api } from "../config/api";
import { useTranslation } from "react-i18next";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: ""
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState([]);
  const { t,i18n } = useTranslation();
  // useEffect(() => {
  //   const savedLang = localStorage.getItem("lang");
  //   if (savedLang && i18n.language !== savedLang) {
  //     i18n.changeLanguage(savedLang);
  //   }
  // }, [i18n]);

  useEffect(() => {
    api.get("auth/roles")
      .then((res) => {
        console.log("role data ", res.data);
        setRole(res.data);
      })
      .catch((err) => console.log("Error fetching roles", err));
  }, []);

  const handleSubmit = (values) => {
    dispatch(registerUser({ userData: values, navigate }));
    console.log("form values ", values);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div>
        <Typography variant="h5" className="text-center">
          {t("register")}
        </Typography>

        {/* Language Switcher */}
        {/* <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <Button onClick={() => changeLanguage("en")}>EN</Button>
          <Button onClick={() => changeLanguage("hi")}>हिंदी</Button>
        </div> */}

        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
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
              <InputLabel id="role-simple-select-label">{t("role")}</InputLabel>
              <Field
                as={Select}
                labelId="role-simple-select-label"
                id="role-simple-select"
                label={t("role")}
                name="role"
              >
                {role.map((data) => (
                  <MenuItem key={data} value={data}>
                    {data}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>

            <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type="submit" variant="contained">
              {t("register")}
            </Button>
          </Form>
        </Formik>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {t("already_have_account")}
          <Button size="small" onClick={() => navigate("/account/login")}>
            {t("login")}
          </Button>
        </Typography>
      </div>
    </div>
  );
};

export default RegisterForm;
