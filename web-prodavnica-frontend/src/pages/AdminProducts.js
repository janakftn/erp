import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import "../pages/AdminDashboard.css";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        ime: "",
        cena: "",
        kolicina: "",
        boja: "",
        brend: "",
        slikaFile: null
    });
    const [errors, setErrors] = useState([]); // state za greške iz DTO-a

    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) fetchProducts();
    }, [token]);

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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!token) return alert("Niste ulogovani!");

        try {
            const formData = new FormData();
            formData.append("Ime", newProduct.ime);
            formData.append("Cena", newProduct.cena);
            formData.append("Kolicina", newProduct.kolicina);
            formData.append("Boja", newProduct.boja);
            formData.append("Brend", newProduct.brend);
            if (newProduct.slikaFile) formData.append("SlikaFile", newProduct.slikaFile);

            await axios.post("http://localhost:5134/api/worker/proizvodi", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setNewProduct({ ime: "", cena: "", kolicina: "", boja: "", brend: "", slikaFile: null });
            setErrors([]); // resetuj greške kada je uspešno
            fetchProducts();
        } catch (err) {
            // hvatamo greške iz backend DTO-a
            if (err.response && err.response.data && err.response.data.Poruke) {
                setErrors(err.response.data.Poruke);
            } else {
                setErrors(["Došlo je do greške prilikom dodavanja proizvoda."]);
            }
        }
    };

    return (
        <div className="admin-products">
            <h1>➕🛒 Dodaj proizvod</h1>

         
            {errors.length > 0 && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {errors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
            )}

            <form onSubmit={handleAddProduct} className="admin-form">
                <input
                    type="text"
                    placeholder="Ime proizvoda"
                    value={newProduct.ime}
                    onChange={e => setNewProduct({ ...newProduct, ime: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Cena"
                    value={newProduct.cena}
                    onChange={e => setNewProduct({ ...newProduct, cena: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Kolicina"
                    value={newProduct.kolicina}
                    onChange={e => setNewProduct({ ...newProduct, kolicina: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Boja"
                    value={newProduct.boja}
                    onChange={e => setNewProduct({ ...newProduct, boja: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Brend"
                    value={newProduct.brend}
                    onChange={e => setNewProduct({ ...newProduct, brend: e.target.value })}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setNewProduct({ ...newProduct, slikaFile: e.target.files[0] })}
                />
                <button type="submit">Dodaj proizvod</button>
            </form>

            
          
        </div>
    );
}

export default AdminProducts;
