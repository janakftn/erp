import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import "../pages/CartDashboard.css";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, totalPrice, products, clearCart } = useContext(CartContext);
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePlus = (item) => {
        const product = products.find(p => p.id === item.id);
        if (!product || product.kolicina === 0) return;
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleMinus = (item) => {
        if (item.quantity === 1) removeFromCart(item.id);
        else updateQuantity(item.id, item.quantity - 1);
    };

    // Plaćanje pouzećem
    const handleCashPayment = async () => {
        if (!user || !token) {
            alert("Morate biti prijavljeni da biste obavili kupovinu.");
            navigate("/login");
            return;
        }

        try {
            const orderData = {
                Placanje: "Pouzece",
                Stavke: cart.map(item => ({
                    ProductId: item.id,
                    Kolicina: item.quantity
                }))
            };

            console.log("🟢 Token koji se šalje:", token);
            console.log("🟢 Podaci porudžbine:", orderData);

            await createOrder(orderData, token);

            alert("✅ Porudžbina uspešno kreirana! Plaćanje pouzećem.");
            clearCart();
            window.location.href = "/user";
        } catch (error) {
            console.error("Greška pri kreiranju porudžbine:", error);
            alert("❌ Greška prilikom kreiranja porudžbine!");
        }
    };

    // Plaćanje karticom – Stripe
    const handleStripePayment = async () => {
        if (!user || !token) {
            alert("Morate biti prijavljeni da biste obavili kupovinu.");
            navigate("/login");
            return;
        }

        try {
            const items = cart.map(item => ({
                ProductId: item.id,
              
                Kolicina: item.quantity
            }));

            const res = await fetch("http://localhost:5134/api/Porudzbine/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(items)
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // preusmerava korisnika na Stripe Checkout
            } else {
                alert("❌ Greška pri kreiranju Stripe sesije!");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Greška pri kreiranju Stripe sesije!");
        }
    };

    return (
        <div className="cart-container">
            <h2>🛒 Tvoja korpa ({cart.reduce((sum, p) => sum + p.quantity, 0)} proizvoda)</h2>

            {cart.length === 0 ? (
                <p className="empty-cart">Korpa je prazna</p>
            ) : (
                <div className="cart-list">
                    {cart.map(item => (
                        <div key={item.id} className="cart-card">
                            {item.slika && (
                                <img
                                    src={item.slika.startsWith("http") ? item.slika : `http://localhost:5134${item.slika}`}
                                    alt={item.ime}
                                    className="cart-img"
                                />
                            )}
                            <div className="cart-info">
                                <h4>{item.ime}</h4>
                                <p>Cena: <strong>{item.cena} RSD</strong></p>
                                <p>Ukupno: <strong>{item.cena * item.quantity} RSD</strong></p>
                            </div>
                            <div className="cart-controls">
                                <button onClick={() => handleMinus(item)} className="control-btn">➖</button>
                                <span className="quantity">{item.quantity}</span>
                                <button
                                    onClick={() => handlePlus(item)}
                                    className="control-btn"
                                    disabled={products.find(p => p.id === item.id)?.kolicina === 0}
                                >
                                    ➕
                                </button>
                            </div>
                        </div>
                    ))}

                    <h3 className="cart-total">
                        🧾 Ukupno za plaćanje: <span>{totalPrice} RSD</span>
                    </h3>

                    <div className="payment-buttons">
                        <button onClick={handleCashPayment} className="pay-btn">
                            💸 Plati pouzećem
                        </button>
                        <button onClick={handleStripePayment} className="stripe-btn">
                            💳 Plati karticom (Stripe)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
