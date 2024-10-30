import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import DiagnosisCode from "../models/DiagnosisCode";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing diagnosis codes.
 */
export default class DiagnosisCodeService {
    private requester: Requester;

    /**
     * Creates an instance of DiagnosisCodeService.
     */
    constructor() {
        this.requester = new Requester(new Authorizer(StoragerFactory.defaultStorager()));
    }

    /**
     * Fetches a list of diagnosis codes, optionally paginated.
     * 
     * @param {number|null} [page=null] - The page number to fetch. If null, fetches all codes.
     * @returns {Promise<DiagnosisCode[]>} - A promise that resolves to an array of DiagnosisCode objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async list(page: number | null = null): Promise<DiagnosisCode[]> {
        const response: IRequesterResponse<DiagnosisCode[]> = await this.requester.get(`/diagnosis${page !== null ? "?page=" + page : ""}`);

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Finds diagnosis codes that match the specified filter, optionally paginated.
     * 
     * @param {string} filter - The filter text to search for in diagnosis codes.
     * @param {number|null} [page=null] - The page number to fetch. If null, fetches all matching codes.
     * @returns {Promise<DiagnosisCode[]>} - A promise that resolves to an array of matching DiagnosisCode objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async find(filter: string, page: number | null = null): Promise<DiagnosisCode[]> {
        const response: IRequesterResponse<DiagnosisCode[]> = await this.requester.get(`/diagnosis/find?text=${filter}${page !== null ? "&page=" + page : ""}`);

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
