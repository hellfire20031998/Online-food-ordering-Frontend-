
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../State/Authentication/Action'


const initialValues = {
    fullName: "",
    email: "",
    password: "",
    role: ""
}

const RegisterForm = () => {
    const dispatch= useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (values) => {
        dispatch(registerUser({userData:values,navigate}))
            console.log("form values ",values)
    }
    
    return (
        <div>
            <div>
                <Typography variant='h5' className='text-center'>
                    Register
                </Typography>

                <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                    <Form>
                        <Field
                            as={TextField}
                            name="fullName"
                            label="FullName"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
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
                            type="password"
                        />
                        <FormControl fullWidth margin='normal'>
                            <InputLabel id="role-simple-select-label">Role</InputLabel>
                            <Field
                                as={Select}
                                labelId="role-simple-select-label"
                                id="role-simple-select"
                                // value={age}
                                label="Role"
                                name="role"
                            // onChange={handleChange}
                            >
                                <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
                                <MenuItem value={"ROLE_RESTAURANT_OWNER"}>Restaurant Owner</MenuItem>

                            </Field>
                        </FormControl>


                        <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type='submit' variant='contained'>Register</Button>
                    </Form>
                </Formik>

                <Typography variant='body2' align='center' sx={{ mt: 3 }}> if have an account already
                    <Button size='small' onClick={() => navigate("/account/login")}
                    >Login</Button>
                </Typography>
            </div>
        </div>
    )
}

export default RegisterForm
