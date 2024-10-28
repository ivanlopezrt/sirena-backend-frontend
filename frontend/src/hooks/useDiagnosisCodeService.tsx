import IRequesterResponse from "../requester/RequesterResponse";
import DiagnosisCode from "../models/DiagnosisCode";
import useRequest from "./useRequest";

/**
 * Custom hook for fetching diagnosis codes from the API.
 *
 * @returns {Object} The service methods for interacting with diagnosis codes.
 */
export default function useDiagnosisCodeService() {
    const { get } = useRequest();

    /**
     * Fetches a paginated list of diagnosis codes.
     *
     * @param {number | null} [page=null] - The page number to fetch, or null to fetch all.
     * @returns {Promise<DiagnosisCode[]>} The list of diagnosis codes for the specified page.
     * @throws Will throw an error if the request fails.
     */
    const list = async (
        page: number | null = null
    ): Promise<DiagnosisCode[]> => {
        const response: IRequesterResponse<DiagnosisCode[]> = await get(
            `/diagnosis${page !== null ? "?page=" + page : ""}`
        );
        if (response.success) {
            return response.data;
        }
        throw new Error(`Error en la petición: ${response.code}`);
    };

    /**
     * Searches for diagnosis codes using a text filter.
     *
     * @param {string} filter - The text to filter diagnosis codes by.
     * @param {number | null} [page=null] - The page number to fetch, or null to fetch all.
     * @returns {Promise<DiagnosisCode[]>} The filtered list of diagnosis codes for the specified page.
     * @throws Will throw an error if the request fails.
     */
    const find = async (
        filter: string,
        page: number | null = null
    ): Promise<DiagnosisCode[]> => {
        const response: IRequesterResponse<DiagnosisCode[]> = await get(
            `/diagnosis/find?text=${filter}${
                page !== null ? "&page=" + page : ""
            }`
        );
        if (response.success) {
            return response.data;
        }
        throw new Error(`Error en la petición: ${response.code}`);
    };

    return { list, find };
}
