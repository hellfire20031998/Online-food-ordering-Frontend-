import {
    Alert,
    Box,
    Button,
    Card,
    Divider,
    Modal,
    Snackbar,
    TextField,
} from "@mui/material";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CartItem from "./CartItem";
import AddressCart from "./AddressCart";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../State/Order/Action";
import { api, getErrorMessage } from "../config/api";

const DELIVERY_FEE = 21;
const GST_AND_CHARGES = 50;

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    outline: "none",
    boxShadow: 24,
    p: 4,
};

const initialValues = {
    fullName: "",
    mobile: "",
    streetAddress: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
};

const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    mobile: Yup.string().required("Required"),
    streetAddress: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pincode: Yup.string().required("Required"),
});

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((store) => store.cart.cart);
    const cartItems = useSelector((store) => store.cart.cartItems);

    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const showSnackbar = (message, severity = "info") =>
        setSnackbar({ open: true, message, severity });

    const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    // The whole cart belongs to one restaurant; take it from the first item's food.
    const restaurantId = cartItems?.[0]?.food?.restaurant?.id;

    const itemTotal = Number(cart?.total) || 0;
    const totalPay = itemTotal + DELIVERY_FEE + GST_AND_CHARGES;

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await api.post("api/users/add_address", values);
            showSnackbar("Address added successfully", "success");
            setAddresses((prev) => [...prev, response.data]);
            setOpen(false);
            resetForm();
        } catch (error) {
            showSnackbar(getErrorMessage(error, "Failed to add address"), "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await api.delete(`api/users/deleteAddress/${addressId}`);
            showSnackbar("Address deleted", "success");
            if (selectedAddress?.id === addressId) setSelectedAddress(null);
            fetchAddresses();
        } catch (error) {
            showSnackbar(getErrorMessage(error, "Error deleting address"), "error");
        }
    };

    const fetchAddresses = useCallback(() => {
        api.get(`api/users/getAddresses`)
            .then((res) => setAddresses(res.data))
            .catch((error) => {
                showSnackbar(getErrorMessage(error, "Could not load addresses"), "error");
            });
    }, []);

    const fetchPayments = useCallback(() => {
        api.get(`api/payment-methods`)
            .then((res) => setPaymentMethods(res.data))
            .catch((error) => {
                showSnackbar(getErrorMessage(error, "Could not load payment methods"), "error");
            });
    }, []);

    useEffect(() => {
        fetchAddresses();
        fetchPayments();
    }, [fetchAddresses, fetchPayments]);

    const placeOrder = async () => {
        if (!cartItems || cartItems.length === 0) {
            showSnackbar("Your cart is empty. Please add items before placing an order.", "warning");
            return;
        }
        if (!selectedAddress || !paymentMethod) {
            showSnackbar("Please select a delivery address and payment method.", "warning");
            return;
        }
        if (!restaurantId) {
            showSnackbar("Could not determine the restaurant for this cart. Please refresh and try again.", "error");
            return;
        }

        setPlacingOrder(true);
        const result = await dispatch(
            createOrder({
                restaurantId,
                deliveryAddress: selectedAddress,
                paymentMethod,
            })
        );
        setPlacingOrder(false);

        if (result?.success) {
            showSnackbar("Your order was placed successfully", "success");
            navigate("/my-profile/orders");
        } else {
            showSnackbar(result?.message || "Failed to place order", "error");
        }
    };

    return (
        <>
            <main className="lg:flex justify-between">
                {/* LEFT PANEL */}
                <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
                    {cartItems.map((item) => (
                        <CartItem item={item} key={item.id} />
                    ))}
                    <Divider />
                    <div className="py-5 px-5">
                        <h2 className="text-lg font-semibold mb-2 text-center">
                            Select Payment Method
                        </h2>
                        <FormControl fullWidth>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                label="Payment Method"
                            >
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method} value={method}>
                                        {method}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Divider />
                    <div className="billDetails px-5 text-sm">
                        <p className="font-extralight py-5">Bill Details</p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-400">
                                <p>Item Total</p>
                                <p>{itemTotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>Delivery Fee</p>
                                <p>{DELIVERY_FEE.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <p>GST and Restaurant Charges</p>
                                <p>{GST_AND_CHARGES.toFixed(2)}</p>
                            </div>
                            <Divider />
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <p>Total Pay</p>
                            <p>{totalPay.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="py-5 flex justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!selectedAddress || !paymentMethod || placingOrder || cartItems.length === 0}
                            onClick={placeOrder}
                        >
                            {placingOrder ? "Placing Order..." : "Place Order"}
                        </Button>
                    </div>
                </section>

                <Divider orientation="vertical" flexItem />

                {/* RIGHT PANEL */}
                <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
                    <div>
                        <h1 className="text-center font-semibold text-2xl py-10">
                            Choose Delivery Address
                        </h1>
                        <div className="flex gap-5 flex-wrap justify-center">
                            {addresses.map((item) => (
                                <AddressCart
                                    key={item.id}
                                    handleSelectAddress={setSelectedAddress}
                                    item={item}
                                    handleDeleteAddress={handleDeleteAddress}
                                    showButton={true}
                                />
                            ))}

                            <Card
                                className="flex gap-5 w-64 p-5 cursor-pointer"
                                onClick={() => setOpen(true)}
                            >
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

            {/* MODAL FORM */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-col gap-4">
                                <Field name="fullName" as={TextField} label="Full Name" fullWidth />
                                <ErrorMessage name="fullName" component="div" className="text-red-500" />

                                <Field name="mobile" as={TextField} label="Mobile" fullWidth />
                                <ErrorMessage name="mobile" component="div" className="text-red-500" />

                                <Field name="streetAddress" as={TextField} label="Street Address" fullWidth />
                                <ErrorMessage name="streetAddress" component="div" className="text-red-500" />

                                <Field name="landmark" as={TextField} label="Landmark" fullWidth />

                                <Field name="city" as={TextField} label="City" fullWidth />
                                <ErrorMessage name="city" component="div" className="text-red-500" />

                                <Field name="state" as={TextField} label="State" fullWidth />
                                <ErrorMessage name="state" component="div" className="text-red-500" />

                                <Field name="pincode" as={TextField} label="Pincode" fullWidth />
                                <ErrorMessage name="pincode" component="div" className="text-red-500" />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Address"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Cart;
