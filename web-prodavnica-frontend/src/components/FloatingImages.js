import React, { useEffect, useState } from "react";
import "./FloatingImages.css";

const sideImages = [
    "/side-images/shirt1.png",
    "/side-images/shirt2.png",
    "/side-images/shirt3.png",
    "/side-images/shirt4.png",
    "/side-images/shirt5.png",
    "/side-images/shirt6.png",
];

const FloatingImages = ({ count = 10 }) => {
    const [floatingItems, setFloatingItems] = useState([]);

    useEffect(() => {
        const items = Array.from({ length: count }, () => {
            const img = sideImages[Math.floor(Math.random() * sideImages.length)];
            const size = 60 + Math.random() * 80; // 60-140px
            const top = Math.random() * window.innerHeight;
            const left = Math.random() * window.innerWidth;
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 5;

            return { img, size, top, left, duration, delay };
        });

        setFloatingItems(items);
    }, [count]);

    return (
        <div className="floating-wrapper">
            {floatingItems.map((item, idx) => (
                <img
                    key={idx}
                    src={item.img}
                    alt="floating"
                    className="floating-img"
                    style={{
                        width: item.size,
                        height: item.size,
                        top: item.top,
                        left: item.left,
                        animationDuration: `${item.duration}s`,
                        animationDelay: `${item.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingImages;
