import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import Hospital from "../models/Hospital";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing hospital data.
 */
export default class HospitalsService {
    private requester: Requester;

    /**
     * Creates an instance of HospitalsService.
     */
    constructor() {
        this.requester = new Requester(new Authorizer(StoragerFactory.defaultStorager()));
    }

    /**
     * Retrieves a list of hospitals.
     *
     * @param {number | null} page - The page number to retrieve. If null, retrieves the first page.
     * @returns {Promise<Hospital[]>} - A promise that resolves to an array of Hospital objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async list(page: number | null = null): Promise<Hospital[]> {
        const response: IRequesterResponse<Hospital[]> = await this.requester.get(
            `/hospitals${page !== null ? "?page=" + page : ""}`
        );

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
