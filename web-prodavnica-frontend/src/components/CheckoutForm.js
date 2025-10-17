
import React, { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const CheckoutForm = ({ userId }) => {
    const { cart, totalPrice, clearCart } = useContext(CartContext);
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        if (!cart.length) {
            setMessage("Korpa je prazna!");
            return;
        }

        setLoading(true);

        try {
            // 1. Pošalji cart i userId na backend
            const res = await axios.post(
                "http://localhost:5134/api/Payment/create-payment-intent",
                {
                    amount: totalPrice() * 100, // RSD u centima
                    userId,
                    items: cart.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        cena: item.cena
                    }))
                }
            );

            const clientSecret = res.data.clientSecret;

            // 2. Potvrdi plaćanje
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    setMessage("Plaćanje uspešno!");
                    clearCart();
                }
            }
        } catch (err) {
            console.error(err);
            setMessage("Greška pri plaćanju");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
            <CardElement options={{ hidePostalCode: true }} />
            <button disabled={!stripe || loading} type="submit" style={{ marginTop: "20px" }}>
                {loading ? "Obrađujem..." : `Plati ${totalPrice()} RSD`}
            </button>
            {message && <div style={{ marginTop: "20px", color: "green" }}>{message}</div>}
        </form>
    );
};

export default CheckoutForm;
