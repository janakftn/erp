import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStripePayment = async () => {
            if (!user || !token) {
                alert("Morate biti prijavljeni da biste platili karticom.");
                navigate("/login");
                return;
            }

            // uzmi cart iz localStorage ili context
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            const res = await fetch("https://localhost:5134/api/Porudzbine/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    Stavke: cart.map(p => ({
                        ProductId: p.id,
                        Kolicina: p.quantity
                    }))
                })
            });

            const data = await res.json();
            // preusmeri korisnika na Stripe Checkout
            window.location.href = data.url;
        };

        handleStripePayment();
    }, [user, token, navigate]);

    return <p>🔄 Preusmeravanje na Stripe...</p>;
};

export default Checkout;
