import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa"; // ikonice
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5134/api/Autorizacija/login", {
                email,
                Sifra: password
            });

            const userData = {
                email: response.data.email,
                tip: response.data.role
            };

            login(userData, response.data.token);

            if (userData.tip === "Admin") navigate("/admin");
            else navigate("/user");

        } catch (err) {
            // prikaz prijateljske greške
            const msg = err.response?.data?.message || "Neuspešna prijava. Proverite email i lozinku.";
            setError(msg);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2 className="auth-title">Prijava</h2>

                {error && <div className="auth-error animate">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <span className="input-icon"><FaUser /></span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-icon"><FaLock /></span>
                        <input
                            type="password"
                            placeholder="Lozinka"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">Prijavi se</button>

                    <p className="auth-footer">
                        Nemate nalog? <span onClick={() => navigate("/register")} className="auth-link">Registrujte se</span>
                    </p>
                </form>
            </div>
        </div>

    );
}

export default Login;
