import { createContext, useEffect, useState, type ReactNode } from "react";
import { type User } from "../types/auth.types";
import { getCurrentUser } from "../api/user.api";

interface AuthContextType {
    user: User | null;
    token: string | null; // Added this
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // Track token in state so components re-render when it changes
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));


	const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken); // Update state
        fetchUser();
    };

	const logout = () => {
        localStorage.removeItem("token");
        setToken(null); // Clear state
        setUser(null);
    };

	const fetchUser = async () => {
		try {
			const res = await getCurrentUser();
			setUser(res.data);
		} catch {
			logout();
		}
	};

	useEffect(() => {
		if (localStorage.getItem("token")) {
			fetchUser();
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout,token }}>
			{children}
		</AuthContext.Provider>
	);
};
