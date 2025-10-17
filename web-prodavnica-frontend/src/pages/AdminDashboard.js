import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import "../pages/AdminDashboard.css";

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <h2>🛒 Admin Panel</h2>
                <nav>
                    <Link to="/admin" className="nav-link">📦 Pregled proizvoda</Link>
                    <Link to="/admin/products" className="nav-link">➕ Dodaj proizvod</Link>
                    <Link to="/admin/orders" className="nav-link">📝 Porudžbine</Link>
                </nav>
            </aside>

            {/* GLAVNI SADRŽAJ */}
            <main className="admin-content">
                <Routes>
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                </Routes>
            </main>
        </div>
    );
}

export default AdminDashboard;
