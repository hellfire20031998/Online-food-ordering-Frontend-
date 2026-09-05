import { Alert, Button, TextField, Typography } from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { loginUser } from '../State/Authentication/Action'

const initialValues = {
  email: "",
  password: ""
}

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required")
})

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const error = useSelector(store => store.auth.error)
  const isLoading = useSelector(store => store.auth.isLoading)

  const handleSubmit = (values) => {
    dispatch(loginUser({ userData: values, navigate }))
  }

  return (
    <div>
      <Typography variant='h5' className='text-center'>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {typeof error === "string" ? error : "Login failed"}
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
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

          <Button
            sx={{ mt: 2, padding: "1rem" }}
            fullWidth
            type='submit'
            variant='contained'
            disabled={isLoading}
          >
            Login
          </Button>
        </Form>
      </Formik>

      <Typography variant='body2' align='center' sx={{ mt: 3 }}>
        Don't have an account?
        <Button size='small' onClick={() => navigate("/account/register")}>
          Register
        </Button>
      </Typography>
    </div>
  )
}

export default LoginForm
