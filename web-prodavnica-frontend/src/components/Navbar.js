import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "../components/Navbar.css";

const Navbar = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (isLoading || location.pathname === "/login" || location.pathname === "/register") return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">Janin Web Shop 👕</div>

            <div className="nav-center">
                {user && user.tip === "Klijent" && (
                    <>
                        <button onClick={() => navigate("/user")} className="nav-btn">🛍️ Proizvodi</button>
                        <button onClick={() => navigate("/cart")} className="nav-btn">
                            🛒 Korpa ({cart.reduce((sum, p) => sum + p.quantity, 0)})
                        </button>
                    </>
                )}
            </div>

            <div>
                {user && <button onClick={handleLogout} className="nav-btn logout-btn">🔓 Logout</button>}
            </div>
        </nav>
    );
};

export default Navbar;
