import { useCallback, useEffect, useState } from "react";
import Authorizer from "../auth/impl/Authorizer";
import User from "../models/User";
import IAuthorizer from "../auth/IAuthorizer";
import { ResponseCodes } from "../models/shared/ResponseCodes";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Custom hook that manages user authentication state, including login, logout,
 * and the retrieval of the current authenticated user and token.
 *
 * @returns An object containing the current user, authentication token, a flag indicating if
 * the data is loaded, and functions to log in and log out.
 */
export default function useAuth() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const authorizer: IAuthorizer = new Authorizer(
        StoragerFactory.defaultStorager()
    );

    /**
     * Retrieves and sets the current authenticated user and token from the authorizer.
     * This function is memoized to avoid unnecessary recalculations.
     */
    const setCU = useCallback(async () => {
        setCurrentUser(await authorizer.currentUser());
        setToken(await authorizer.token());
        setLoaded(true);
    }, []);

    /**
     * Effect hook that runs once to initialize the current user and token when the component mounts.
     */
    useEffect(() => {
        setCU();
    }, [setCU]);

    /**
     * Logs out the current user, clearing both the currentUser and token states.
     */
    const logout = async () => {
        await authorizer.logOut();
        setCurrentUser(null);
        setToken(null);
    };

    /**
     * Logs in the user using the provided email and code, updating the currentUser state if successful.
     *
     * @param email - The user's email address.
     * @param code - The login code for authentication.
     */
    const login = async (email: string, code: string) => {
        const response = await authorizer.login(email, code);
        if (response.code === ResponseCodes.OK && response.token) {
            setCurrentUser(await authorizer.currentUser());
        }
    };

    return { currentUser, token, setCurrentUser, loaded, logout, login };
}
