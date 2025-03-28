import { Password } from '@mui/icons-material'
import { Button, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const initialValues={
    email:"",
    password:""
}
const LoginForm = () => {
    const handleSubmit=()=>{

    }
    const navigate = useNavigate();

  return (
    <div>
      <Typography variant='h5' className='text-center'>
        Login
      </Typography>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            <Form>
                <Field
                as={TextField}
                name="email"
                label="email"
                fullWidth
                variant="outlined"
                margin="normal"
                />
                 <Field
                as={TextField}
                name="password"
                label="password"
                fullWidth
                variant="outlined"
                margin="normal"
                />

                <Button sx={{mt:2,padding:"1rem"}} fullWidth type='submit' variant='contained'>Login</Button>
            </Form>
      </Formik>

      <Typography variant='body2' align='center' sx={{mt:3}}> Don't have an account
        <Button size='small' onClick={()=>navigate("/account/register")}
        >register</Button>
      </Typography>
    </div>
  )
}

export default LoginForm
