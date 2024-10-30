import { createContext, useContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import User from "../models/User";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext<{
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
    loaded: boolean;
    logout: () => void;
    login: (email: string, code: string) => Promise<void>;
}>({
    currentUser: null,
    setCurrentUser: () => {},
    loaded: false,
    logout: () => {},
    login: () => {
        return new Promise(() => {});
    },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { currentUser, token, setCurrentUser, loaded, logout, login } =
        useAuth();
    const navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        if (
            loaded &&
            !currentUser &&
            !location.pathname.startsWith("/public")
        ) {
            navigate(process.env.REACT_APP_LOGIN_URL!, { replace: true });
        }
    }, [navigate, currentUser, loaded, location, token]);

    return (
        <AuthContext.Provider
            value={{ currentUser, setCurrentUser, loaded, logout, login }}
        >
            {!loaded ? <>Cargando...</> : children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
