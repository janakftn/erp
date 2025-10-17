import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import "../pages/UserDashboard.css";

const UserDashboard = () => {
    const { products, addToCart } = useContext(CartContext);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        let data = [...products];
        if (search) {
            data = data.filter(
                p =>
                    p.ime.toLowerCase().includes(search.toLowerCase()) ||
                    p.brend.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sort === "cena-asc") data.sort((a, b) => a.cena - b.cena);
        if (sort === "cena-desc") data.sort((a, b) => b.cena - a.cena);
        if (sort === "ime") data.sort((a, b) => a.ime.localeCompare(b.ime));

        setFilteredProducts(data);
    }, [products, search, sort]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

    const sideImages = [
        "/side-images/shirt1.png",
        "/side-images/shirt2.png",
        "/side-images/shirt3.png",
        "/side-images/shirt4.png",
        "/side-images/shirt7.png",
        "/side-images/shirt6.png",
        "/side-images/shirt8.png",
        "/side-images/shirt5.png"

    ];

    return (
        <div className="dashboard-wrapper">
            {/* LEVI SIDEBAR */}
            <div className="sidebar-left">
                <div className="floating-container">
                    {sideImages.concat(sideImages).map((img, idx) => (
                        <img key={idx} src={img} alt={`shirt-${idx}`} />
                    ))}
                </div>
            </div>

            {/* GLAVNI DEO */}
            <div className="dashboard-center">
                <h2>🛒 Naši proizvodi</h2>
                <input
                    type="text"
                    placeholder="Pretraži po imenu ili brendu"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                    <option value="">Sortiraj</option>
                    <option value="cena-asc">Cena rastuće</option>
                    <option value="cena-desc">Cena opadajuće</option>
                    <option value="ime">Ime</option>
                </select>
                
                <div className="product-list-wrapper">
                    {currentItems.map((p) => (
                        <div key={p.id} className="product-card">
                            {p.slika && (
                                <img
                                    src={p.slika.startsWith("http") ? p.slika : `http://localhost:5134${p.slika}`}
                                    alt={p.ime}
                                />
                            )}
                            <h3>{p.ime}</h3>
                            <p>Brend: {p.brend}</p>
                            <p>Boja: {p.boja}</p>
                            <b>Cena: {p.cena} RSD</b>
                            <p>Na stanju: {p.kolicina}</p>
                            <button
                                className="add-to-cart-btn"
                                onClick={() => addToCart(p)}
                                disabled={p.kolicina === 0}
                            >
                                👚 Dodaj u korpu
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            disabled={currentPage === i + 1}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <footer className="modern-footer">
                    <div className="footer-line"></div>
                    <div className="footer-content">
                        <span>© 2025 WebProdavnica</span>
                        <span>|</span>
                        <span>Izradila Jana Kozova</span>
                        <span>|</span>
                        <a href="mailto:jana.kozova2001@gmail.com">✉️ jana.kozova2001@gmail.com</a>
                    </div>
                </footer>
            </div>

            {/* DESNI SIDEBAR */}
            <div className="sidebar-right">
                <div className="floating-container">
                    {sideImages.concat(sideImages).map((img, idx) => (
                        <img key={idx} src={img} alt={`shirt-${idx}`} />
                    ))}
                </div>
            </div>
        </div>

    );
};

export default UserDashboard;
