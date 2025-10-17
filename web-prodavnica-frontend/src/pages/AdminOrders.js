import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../pages/AdminDashboard.css";
import { AuthContext } from "../context/AuthContext";

function AdminOrders() {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5134/api/Porudzbine", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.reverse()); // poslednja dodata porudžbina je prva
        } catch (err) {
            console.error(err);
            alert("Greška pri učitavanju porudžbina!");
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            if (newStatus === "Otkazano") {
                await axios.delete(`http://localhost:5134/api/Porudzbine/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(
                    `http://localhost:5134/api/Porudzbine/${orderId}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchOrders(); // osvežava prikaz porudžbina
        } catch (err) {
            console.error(err);
            alert("Greška pri ažuriranju porudžbine!");
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "NaCekanju": return "#f0ad4e";
            case "Isporuceno": return "#5cb85c";
            case "Otkazano": return "#d9534f";
            default: return "#6c757d";
        }
    };

    const calcTotal = (proizvodi = []) =>
        proizvodi.reduce((sum, p) => sum + (p.cena || 0) * (p.kolicina || 0), 0);

    const getPaymentLabel = (p) => {
        if (!p) return "Nepoznato";
        return p.toLowerCase() === "stripe" || p.toLowerCase() === "kartica"
            ? "💳 Kartica"
            : "💵 Pouzećem";
    };

    return (
        <div className="admin-orders-container">
            <h1>📦 Pregled porudžbina</h1>
            {orders.length === 0 ? (
                <p>Nema porudžbina.</p>
            ) : (
                <div className="orders-grid">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-id"># {order.id}</span>
                                <span
                                    className="order-status"
                                    style={{ backgroundColor: statusColor(order.status) }}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-payment">
                                <strong>💰 Plaćanje:</strong> {getPaymentLabel(order.placanje)}
                            </div>

                            <div className="order-user">
                                <strong>
                                    {order.korisnik?.ime} {order.korisnik?.prezime}
                                </strong><br />
                                <small title={order.korisnik?.email}>{order.korisnik?.email}</small><br />
                                <span>{order.korisnik?.adresa}</span><br />
                                <span>📞 {order.korisnik?.brojTelefona}</span>
                            </div>

                            <div className="order-products">
                                {(order.proizvodi || []).map(p => (
                                    <div key={p.productId} className="product-item">
                                        {p.slika && (
                                            <img
                                                src={p.slika.startsWith("http") ? p.slika : `http://localhost:5134${p.slika}`}
                                                alt={p.ime}
                                                className="product-img"
                                            />
                                        )}
                                        <div>
                                            <strong>{p.ime}</strong> ({p.brend})<br />
                                            Boja: {p.boja}<br />
                                            {p.kolicina} x {p.cena} RSD
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total">
                                <strong>Ukupno: {calcTotal(order.proizvodi)} RSD</strong>
                            </div>

                            <div className="order-actions">
                                {order.status !== "Isporuceno" && order.status !== "Otkazano" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(order.id, "Isporuceno")}
                                            className="btn-delivered"
                                        >
                                            ✅ Isporučeno
                                        </button>
                                        <button
                                            onClick={() => updateStatus(order.id, "Otkazano")}
                                            className="btn-cancel"
                                        >
                                            ❌ Otkaži
                                        </button>
                                    </>
                                )}
                                {order.status === "Isporuceno" && (
                                    <button
                                        onClick={() => updateStatus(order.id, "Otkazano")} 
                                        className="btn-delete"
                                    >
                                        🗑️ Obriši porudžbinu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
