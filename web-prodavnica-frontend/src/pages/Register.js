import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ista forma kao Login

function Register() {
    const [form, setForm] = useState({
        korisnickoIme: "",
        sifra: "",
        email: "",
        ime: "",
        prezime: "",
        adresa: "",
        brojTelefona: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5134/api/Autorizacija/register", form);
            alert("Uspesna registracija!");
            navigate("/login"); // nakon registracije ide na login
        } catch (err) {
            console.error(err);
            setError(err.response?.data.message || "Greška pri registraciji!");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2 className="auth-title">Registracija</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    {Object.keys(form).map((key) => (
                        <input
                            key={key}
                            type={key === "sifra" ? "password" : "text"}
                            name={key}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={form[key]}
                            onChange={handleChange}
                            required
                        />
                    ))}
                    <button type="submit">Registruj se</button>
                    <p className="auth-footer">
                        Već imate nalog? <span className="auth-link" onClick={() => navigate("/login")}>Prijavite se</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
