import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import User from "../models/User";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing user data.
 */
export default class UsersService {
    private requester: Requester;

    /**
     * Creates an instance of UsersService.
     */
    constructor() {
        this.requester = new Requester(new Authorizer(StoragerFactory.defaultStorager()));
    }

    /**
     * Retrieves a list of users.
     *
     * @param {number | null} page - The page number to retrieve. If null, retrieves the first page.
     * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async list(page: number | null = null): Promise<User[]> {
        const response: IRequesterResponse<User[]> = await this.requester.get(
            `/users${page !== null ? "?page=" + page : ""}`
        );

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
