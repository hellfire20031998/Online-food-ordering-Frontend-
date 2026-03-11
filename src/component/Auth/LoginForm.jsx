import { Password } from '@mui/icons-material'
import { Button, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../State/Authentication/Action'
import { useTranslation } from 'react-i18next'

const initialValues={
    email:"",
    password:""
}
const LoginForm = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
     const { t,i18n } = useTranslation();
      // useEffect(() => {
      //   const savedLang = localStorage.getItem("lang");
      //   if (savedLang && i18n.language !== savedLang) {
      //     i18n.changeLanguage(savedLang);
      //   }
      // }, [i18n]);

    const handleSubmit=(values)=>{
      dispatch(loginUser({userData:values,navigate}))
    }

   
  return (
    <div>
      <Typography variant='h5' className='text-center'>
       {t("login")}
      </Typography>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            <Form>
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
                />

                <Button sx={{mt:2,padding:"1rem"}} fullWidth type='submit' variant='contained'>{t('login')}</Button>
            </Form>
      </Formik>

      <Typography variant='body2' align='center' sx={{mt:3}}> Don't have an account
        <Button size='small' onClick={()=>navigate("/account/register")}
        >{t("register")}</Button>
      </Typography>
    </div>
  )
}

export default LoginForm
