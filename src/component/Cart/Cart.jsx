import { Box, Button, Card, Divider, Grid, Modal, TextField } from '@mui/material';
import React from 'react';
import CartItem from './CartItem';
import AddressCart from './AddressCart';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from "yup";

const items = [1, 1];

function Cart() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        outline: "none",
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = React.useState(false);

    const handleOpenAddressModel = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = (values, { resetForm }) => {
        console.log("Form Submitted", values);
        resetForm();
        setOpen(false);
    };

    const initialValues = {
        streetAddress: "",
        state: "",
        pincode: "",
        city: ""
    };

    const validationSchema = Yup.object({
        streetAddress: Yup.string().required("Street address is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string()
            .matches(/^\d{6}$/, "Pincode must be 6 digits")
            .required("Pincode is required"),
        city: Yup.string().required("City is required"),
    });

    const createOrderUsingSelectedAddress = () => {
        // Handle order creation
    };

    return (
        <>
            <main className="lg:flex justify-between">
                <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
                    {items.map((item, index) => (
                        <CartItem key={index} />
                    ))}
                    <Divider />
                    <div className="billDetails px-5 text-sm">
                        <p className="font-extralight py-5">Bill Details</p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-400">
                                <p>Item Total</p>
                                <p>$1000</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>Delivery Fee</p>
                                <p>$21</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>GST and Restaurant Charges</p>
                                <p>$50</p>
                            </div>
                            <Divider />
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <p>Total Pay</p>
                            <p>$1200</p>
                        </div>
                    </div>
                </section>

                <Divider orientation="vertical" flexItem />

                <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
                    <div>
                        <h1 className="text-center font-semibold text-2xl py-10">
                            Choose Delivery Address
                        </h1>
                        <div className="flex gap-5 flex-wrap justify-center">
                            {[1, 1, 1, 1, 1].map((item, index) => (
                                <AddressCart
                                    key={index}
                                    handleSelectAddress={createOrderUsingSelectedAddress}
                                    item={item}
                                    showButton={true}
                                />
                            ))}
                            <Card className="flex gap-5 w-64 p-5 cursor-pointer" onClick={handleOpenAddressModel}>
                                <AddLocationAltIcon />
                                <div className="space-y-3 text-gray-500">
                                    <h1 className="font-semibold text-lg text-white">Add New Address</h1>

                                    <Button variant="outlined" fullWidth>
                                        Add
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Address Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({ isSubmitting }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="streetAddress"
                                            label="Street Address"
                                            fullWidth
                                            variant="outlined"
                                            error={<ErrorMessage name="streetAddress" />}
                                            helperText={<ErrorMessage name="streetAddress" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            as={TextField}
                                            name="city"
                                            label="City"
                                            fullWidth
                                            variant="outlined"
                                            error={<ErrorMessage name="city" />}
                                            helperText={<ErrorMessage name="city" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            as={TextField}
                                            name="state"
                                            label="State"
                                            fullWidth
                                            variant="outlined"
                                            error={<ErrorMessage name="state" />}
                                            helperText={<ErrorMessage name="state" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            as={TextField}
                                            name="pincode"
                                            label="Pincode"
                                            fullWidth
                                            variant="outlined"
                                            error={<ErrorMessage name="pincode" />}
                                            helperText={<ErrorMessage name="pincode" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                                            Save Address
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
}

export default Cart;
