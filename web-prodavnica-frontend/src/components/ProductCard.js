import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProductCard = ({ product, refreshProducts }) => {
    const { token } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [editProduct, setEditProduct] = useState({ ...product });

    // 🗑️ Brisanje proizvoda
    const handleDelete = async () => {
        if (!token) return;
        

        await axios.delete(`http://localhost:5134/api/worker/proizvodi/${product.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        refreshProducts();
    };

    // ✏️ Izmena proizvoda
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!token) return;

        const formData = new FormData();
        formData.append("Ime", editProduct.ime);
        formData.append("Cena", editProduct.cena);
        formData.append("Kolicina", editProduct.kolicina);
        formData.append("Boja", editProduct.boja);
        formData.append("Brend", editProduct.brend);
        if (editProduct.slikaFile) formData.append("SlikaFile", editProduct.slikaFile);

        await axios.put(`http://localhost:5134/api/worker/proizvodi/${product.id}`, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });

        setEditMode(false);
        refreshProducts();
    };

    return (
        <div className="product-card">
            {editMode ? (
                <form onSubmit={handleUpdate}>
                    <input type="text" value={editProduct.ime} onChange={e => setEditProduct({ ...editProduct, ime: e.target.value })} />
                    <input type="number" value={editProduct.cena} onChange={e => setEditProduct({ ...editProduct, cena: e.target.value })} />
                    <input type="number" value={editProduct.kolicina} onChange={e => setEditProduct({ ...editProduct, kolicina: e.target.value })} />
                    <input type="text" value={editProduct.boja} onChange={e => setEditProduct({ ...editProduct, boja: e.target.value })} />
                    <input type="text" value={editProduct.brend} onChange={e => setEditProduct({ ...editProduct, brend: e.target.value })} />
                    <input type="file" onChange={e => setEditProduct({ ...editProduct, slikaFile: e.target.files[0] })} />
                    <button type="submit">💾 Sačuvaj</button>
                    <button type="button" onClick={() => setEditMode(false)}>❌ Otkaži</button>
                </form>
            ) : (
                <>
                    {product.slika && (
                        <img
                            src={product.slika.startsWith("http") ? product.slika : `http://localhost:5134${product.slika}`}
                            alt={product.ime}
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                    <h3>{product.ime}</h3>
                    <p>Brend: {product.brend}</p>
                    <p>Boja: {product.boja}</p>
                    <p>Količina: {product.kolicina}</p>
                    <b>{product.cena} RSD</b>
                    <div>
                        <button onClick={() => setEditMode(true)}>✏️ Izmeni</button>
                        <button onClick={handleDelete}>🗑️ Obriši</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductCard;
