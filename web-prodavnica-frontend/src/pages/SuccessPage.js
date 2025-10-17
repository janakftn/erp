import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Učitavanje...");

    useEffect(() => {
        // Ovde možeš pozvati backend da dobiješ stvarnu porudžbinu preko userId ili sessionId
        // Za test ćemo prikazati statički sadržaj
        setTimeout(() => {
            setMessage("✅ Plaćanje uspešno! Porudžbina je kreirana.");
        }, 500);

        // Automatski redirect posle 5 sekundi
        const timer = setTimeout(() => {
            navigate("/user"); // ili /cart ili istorija porudžbina
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{message}</h1>
            <p>Hvala što ste kupili kod nas! 🎉</p>
            <p>Bićete preusmereni na vašu korisničku stranicu za 5 sekundi...</p>
        </div>
    );
};

export default SuccessPage;
