import { createContext, useContext, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://signin-api.free.beeceptor.com"; // Beeceptor API URL

// Manual valid user credentials
const VALID_USER = {
    email: "johndoe@example.com",
    password: "password123",
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || null);

    // 🟢 Sign In Function
    const signIn = async (userData) => {
        const { email, password } = userData;

        // ✅ First, check if user exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = existingUsers.find(user => user.email === email && user.password === password);

        if (foundUser) {
            localStorage.setItem("token", "dummyToken123"); // Simulated token
            localStorage.setItem("userEmail", email);
            setToken("dummyToken123");
            setUserEmail(email);
            return { success: true, message: "Login successful!" };
        }

        // ✅ Check manual credentials
        if (email === VALID_USER.email && password === VALID_USER.password) {
            try {
                const response = await axios.post(`${API_BASE_URL}/signin`, userData);

                if (response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userEmail", email);
                    setToken(response.data.token);
                    setUserEmail(email);
                    return { success: true, message: "Login successful!" };
                }
            } catch (error) {
                return { success: false, message: "Something went wrong. Please try again." };
            }
        } else {
            try {
                await axios.post(`${API_BASE_URL}/signinfail`, userData);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    return { success: false, message: "Invalid credentials. Please try again." };
                }
            }
        }

        return { success: false, message: "Invalid credentials. Please try again." };
    };

    // 🟢 Sign Up Function
    const signUp = async (userData) => {
        try {
            const { email, password } = userData;
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

            if (existingUsers.find(user => user.email === email)) {
                return { success: false, message: "User already exists. Try logging in." };
            }

            existingUsers.push({ email, password });
            localStorage.setItem("users", JSON.stringify(existingUsers));

            const response = await axios.post(`${API_BASE_URL}/signup`, userData);

            if (response.status === 200) {
                localStorage.setItem("token", "dummyToken123");
                localStorage.setItem("userEmail", email);
                setToken("dummyToken123");
                setUserEmail(email);
                return { success: true, message: "Signup successful!" };
            } else {
                return { success: false, message: "Signup failed. Try again." };
            }
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    };

    // Sign Out Function
    const signOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setToken(null);
        setUserEmail(null);
    };

    // Get Token Function
    const getToken = () => token;

    return (
        <AuthContext.Provider value={{ token, userEmail, signIn, signUp, signOut, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth
export const useAuth = () => {
    return useContext(AuthContext);
};
