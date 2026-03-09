import { createContext, useContext, useState, useEffect } from "react";
import { GetUserDetails } from "@/services/Users";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await GetUserDetails();

            if (response?.data?.user) {
                setUser(response.data.user);
            }

            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
