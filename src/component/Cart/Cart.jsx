import {
    Box,
    Button,
    Card,
    Divider,
    Modal,
    TextField,
} from "@mui/material";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
  } from "@mui/material";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import AddressCart from "./AddressCart";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../State/Order/Action";
import { api } from "../config/api";

const Cart = () => {
    const dispatch = useDispatch();
    const { cart, auth } = useSelector((store) => store);

    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [address, setAddress] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);

    const jwt = localStorage.getItem("jwt");

    const style = {
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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await api.post("api/users/add_address", values, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            alert("Address added successfully!");
            setAddress((prev) => [...prev, response.data]);
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Failed to add address");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await api.delete(`/api/users/deleteAddress/${addressId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            alert("Address deleted successfully");
            fetchAddress();
        } catch (err) {
            console.error("Failed to delete address", err);
            alert("Error deleting address");
        }
    };

    const fetchAddress = () => {
        api
            .get(`api/users/getAddresses`, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((res) => setAddress(res.data))
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 403) {
                    alert("You are not authorized to access this resource.");
                }
            });
    };

    const fetchPayments = () => {
        api
            .get(`api/payment-methods`, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((res) => setPaymentMethods(res.data))
            .catch((err) => console.error("Payment method fetch error", err));
    };
    // console.log("cart cartitems ",cart.cartItems)
    
    const placeOrder = (id) => {
        
        if (!selectedAddress || !paymentMethod) return;
        if (!cart.cartItems || cart.cartItems.length === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
          }
          console.log("rest id ----------",id)
          
        const data = {
            jwt,
            order: {
                
                restaurantId:id,
                deliveryAddress: selectedAddress,
                paymentMethod: paymentMethod,
            },
        };
        dispatch(createOrder(data));
        alert("Your order is successfully palced" );
    };

    useEffect(() => {
        fetchAddress();
        fetchPayments();
    }, []);

    // console.log("cart from cart ", cart)

    return (
        <>
            <main className="lg:flex justify-between">
                {/* LEFT PANEL */}
                <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
                    {cart.cartItems.map((item, index) => (
                        <CartItem item={item} key={index} />
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
                                {paymentMethods.map((method, idx) => (
                                    <MenuItem key={idx} value={method}>
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
                                <p>{cart.cart?.total}</p>
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
                            <p>{cart.cart?.total + 50 + 21}</p>
                        </div>
                    </div>
                    <div className="py-5 flex justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!selectedAddress || !paymentMethod}
                            onClick={()=>placeOrder(cart.cartItems[0].food.id)}
                        >
                            Place Order
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
                            {address.map((item, index) => (
                                <AddressCart
                                    key={index}
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
                <Box sx={style}>
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
        </>
    );
};

export default Cart;
