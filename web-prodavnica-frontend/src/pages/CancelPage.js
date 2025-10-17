import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Učitavanje...");

    useEffect(() => {
        // Prikazujemo poruku korisniku
        setTimeout(() => {
            setMessage("❌ Plaćanje je otkazano. Porudžbina nije kreirana.");
        }, 500);

        // Automatski redirect posle 5 sekundi, npr. na korpu
        const timer = setTimeout(() => {
            navigate("/cart");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{message}</h1>
            <p>Možete pokušati ponovo ili izmeniti svoju korpu 🛒</p>
            <p>Bićete preusmereni na korpu za 5 sekundi...</p>
        </div>
    );
};

export default CancelPage;
