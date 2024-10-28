import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import { useAuthContext } from "../context/AuthContext";
import { ResponseCodes } from "../models/shared/ResponseCodes";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Custom hook to manage HTTP requests with automatic handling of forbidden responses.
 * Integrates authorization and logout mechanisms for secure API interaction.
 *
 * @returns {Object} Contains methods for GET, POST, and DELETE requests.
 */
export default function useRequest() {
    const { logout } = useAuthContext();
    const requester: Requester = new Requester(
        new Authorizer(StoragerFactory.defaultStorager())
    );

    /**
     * Performs a GET request and handles forbidden responses.
     *
     * @template T
     * @param {string} endpoint - The API endpoint to request.
     * @param {Object} headers - Optional headers to include in the request.
     * @returns {Promise<IRequesterResponse<T>>} The response data wrapped in a `IRequesterResponse` object.
     */
    async function get<T>(
        endpoint: string,
        headers: {} = {}
    ): Promise<IRequesterResponse<T>> {
        return await handleForbidden(await requester.get(endpoint, headers));
    }

    /**
     * Performs a POST request and handles forbidden responses.
     *
     * @template T
     * @param {string} endpoint - The API endpoint to request.
     * @param {Object} [body] - Optional body to include in the request.
     * @param {Object} headers - Optional headers to include in the request.
     * @returns {Promise<IRequesterResponse<T>>} The response data wrapped in a `IRequesterResponse` object.
     */
    async function post<T>(
        endpoint: string,
        body?: {},
        headers: {} = {}
    ): Promise<IRequesterResponse<T>> {
        return await handleForbidden(
            await requester.post(endpoint, body, headers)
        );
    }

    /**
     * Performs a DELETE request and handles forbidden responses.
     *
     * @template T
     * @param {string} endpoint - The API endpoint to request.
     * @param {Object} [body] - Optional body to include in the request.
     * @param {Object} headers - Optional headers to include in the request.
     * @returns {Promise<IRequesterResponse<T>>} The response data wrapped in a `IRequesterResponse` object.
     */
    async function remove<T>(
        endpoint: string,
        body?: {},
        headers: {} = {}
    ): Promise<IRequesterResponse<T>> {
        return await handleForbidden(
            await requester.delete(endpoint, body, headers)
        );
    }

    /**
     * Handles forbidden responses (403) by logging out the user if the response code is FORBIDDEN.
     *
     * @template T
     * @param {IRequesterResponse<T>} response - The response to check.
     * @returns {Promise<IRequesterResponse<T>>} The same response, after handling any forbidden errors.
     */
    async function handleForbidden<T>(
        response: IRequesterResponse<T>
    ): Promise<IRequesterResponse<T>> {
        if (response.code === ResponseCodes.FORBIDDEN) {
            logout();
        }
        return response;
    }

    return { get, post, remove };
}
