import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    // Fetch proizvoda
    const fetchProducts = async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5134/api/User/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Greška pri učitavanju proizvoda:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    // Dodavanje u korpu
    const addToCart = (product) => {
        if (product.kolicina === 0) return;

        setCart((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });

        // Smanji stanje proizvoda
        setProducts((prev) =>
            prev.map((p) =>
                p.id === product.id ? { ...p, kolicina: p.kolicina - 1 } : p
            )
        );
    };

    // Uklanjanje iz korpe
    const removeFromCart = (id) => {
        const productInCart = cart.find((p) => p.id === id);
        if (productInCart) {
            // Vrati količinu na stanje
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, kolicina: p.kolicina + productInCart.quantity } : p
                )
            );
        }
        setCart((prev) => prev.filter((p) => p.id !== id));
    };

    // Promena količine
    const updateQuantity = (id, newQuantity) => {
        const oldProduct = cart.find((p) => p.id === id);
        if (!oldProduct) return;

        const diff = newQuantity - oldProduct.quantity;

        setCart((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, quantity: newQuantity } : p
            )
        );

        // Ažuriraj stanje
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, kolicina: p.kolicina - diff } : p
            )
        );
    };

    const clearCart = () => {
        setProducts((prev) =>
            prev.map((p) => {
                const inCart = cart.find((c) => c.id === p.id);
                if (inCart) return { ...p, kolicina: p.kolicina + inCart.quantity };
                return p;
            })
        );
        setCart([]);
    };

    // Ukupna cena
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.cena * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                products,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalPrice,
                fetchProducts,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
