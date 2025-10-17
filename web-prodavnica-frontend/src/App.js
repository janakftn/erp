import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomeDashboard from "./pages/HomeDashboard";
import { AuthProvider } from "./context/AuthContext";
import UserDashboard from "./pages/UserDashboard";
import { CartProvider } from "./context/CartContext";



function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Navbar /> {/* ovo mora biti iznad Routes da se vidi na svakoj stranici */}
                    <div className="container">
                        <Routes>

                            <Route path="/" element={<Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/admin/*" element={<AdminDashboard />} />
                            <Route path="/admin" element={<HomeDashboard />} />
                            <Route path="/user" element={<UserDashboard />} />
                            <Route path="/success" element={<SuccessPage />} />
                            <Route path="/cancel" element={<CancelPage />} />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
