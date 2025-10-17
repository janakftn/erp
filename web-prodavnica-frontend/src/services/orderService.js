import axios from "axios";

const API_URL = "http://localhost:5134/api/Porudzbine";

// Kreiranje porudžbine (pouzećem ili Stripe)
export const createOrder = async (orderData, token) => {
    const response = await axios.post(API_URL, orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return response.data;
};

// Uzimanje svih porudžbina (za admina)
export const getAllOrders = async (token) => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
