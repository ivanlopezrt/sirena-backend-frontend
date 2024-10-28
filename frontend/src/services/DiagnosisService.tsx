import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import DiagnosticData from "../models/DiagnosticData";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing diagnostic data for patients.
 */
export default class DiagnosisService {
    private requester: Requester;

    /**
     * Creates an instance of DiagnosisService.
     */
    constructor() {
        this.requester = new Requester(new Authorizer(StoragerFactory.defaultStorager()));
    }

    /**
     * Saves diagnostic data for a patient.
     * 
     * @param {DiagnosticData} diagnosticData - The diagnostic data to save.
     * @returns {Promise<boolean>} - A promise that resolves to true if the diagnostic data was successfully saved.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async save(diagnosticData: DiagnosticData): Promise<boolean> {
        const response: IRequesterResponse<boolean> = await this.requester.post(`/patient/diagnosis`, diagnosticData);

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
