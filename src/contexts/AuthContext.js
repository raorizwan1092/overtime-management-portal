import { createContext, useContext, useState, useEffect } from "react";
import { GetUserDetails } from "@/services/Users";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await GetUserDetails();
            if (response?.data?.user) {
                setUser(response?.data.user);
            }
        } catch (error) {
            toast?.error(error ? error?.response?.data?.error : "Something went wrong")
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
