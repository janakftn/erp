import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setisLoading] = useState(true); // dodajemo loading

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        if (userData && savedToken) {
            setUser(JSON.parse(userData));
            setToken(savedToken);
        }
        setisLoading(false); // ucitavanje zavrseno
    }, []);

    const login = (userData, jwtToken, role) => {
        const userWithRole = { ...userData, role };
        setUser(userWithRole);
        setToken(jwtToken);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        localStorage.setItem("token", jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

