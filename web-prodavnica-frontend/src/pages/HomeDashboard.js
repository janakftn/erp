import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard"; 
import "../pages/HomeDashboard.css";


const HomeDashboard = () => {
    const [products, setProducts] = useState([]);
    const { token } = useContext(AuthContext);

    // funkcija za osvežavanje liste proizvoda
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5134/api/worker/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Greška pri učitavanju proizvoda:", err);
        }
    };

    useEffect(() => {
        if (token) fetchProducts();
    }, [token]);

    if (products.length === 0) {
        return (
            <div className="admin-home">
                <div className="empty-state">
                    <h2>🛍️ Trenutno nema proizvoda</h2>
                    <p>Dodaj prvi proizvod i započni svoju prodavnicu!</p>
                    <Link to="/admin/products" className="add-btn">
                        ➕ Dodaj proizvod
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-home">
            <div className="summary">
                <h2>Dobrodošao nazad, Admin!</h2>
                <p>Ukupno proizvoda: <strong>{products.length}</strong></p>
                <Link to="/admin/products" className="see-btn">
                    📦 Dodaj proizvod i vidi sve porudžbine
                </Link>
            </div>

            <div className="product-list-wrapper">
               
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            refreshProducts={fetchProducts} // prosleđuje se callback ProductCard-u
                        />
                    ))}
               
            </div>
           

        </div>
    );
};

export default HomeDashboard;
