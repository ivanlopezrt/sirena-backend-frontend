import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import Chat from "../models/Chat";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Types for chart responses.
 */
export type TopsByMonthResponse = {
    tops: string[];
    diagnoses: { day: string; code: string; total: number }[];
};

export type TopsEverResponse = { code: string; total: number };
export type EvolutionResponse = { day: string; code: string; total: number }[];

/**
 * Service for interacting with chart data related to diagnoses.
 */
export default class ChartService {
    private requester: Requester;
    private authorizer: Authorizer;

    /**
     * Creates an instance of ChartService.
     */
    constructor() {
        this.authorizer = new Authorizer(StoragerFactory.defaultStorager());
        this.requester = new Requester(this.authorizer);
    }

    /**
     * Fetches diagnoses from the last specified days.
     * 
     * @param {number} [days=30] - The number of days to look back for diagnoses.
     * @returns {Promise<any[]>} - A promise that resolves to an array of diagnoses.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async lastDaysDiagnosis(days: number = 30): Promise<any[]> {
        const response: IRequesterResponse<Chat[]> = await this.requester.get("/chart/last_days");
        
        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Fetches the top diagnoses for the specified month and year.
     * 
     * @param {number} [month=new Date().getMonth()] - The month to fetch data for (0-11).
     * @param {number} [year=new Date().getFullYear()] - The year to fetch data for.
     * @returns {Promise<TopsByMonthResponse>} - A promise that resolves to the top diagnoses for the month.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async topsByMonth(month: number = new Date().getMonth(), year = new Date().getFullYear()): Promise<TopsByMonthResponse> {
        const response: IRequesterResponse<TopsByMonthResponse> = await this.requester.get("/chart/top_month");
        
        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Fetches the top diagnoses of all time.
     * 
     * @param {number} take - The number of top diagnoses to fetch.
     * @returns {Promise<TopsEverResponse[]>} - A promise that resolves to an array of the top diagnoses ever.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async topsEver(take: number): Promise<TopsEverResponse[]> {
        const response: IRequesterResponse<TopsEverResponse[]> = await this.requester.get("/chart/top_ever");
        
        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Fetches the evolution of a specific diagnosis code over a specified year.
     * 
     * @param {string} code - The diagnosis code to analyze.
     * @param {number} [year=new Date().getFullYear()] - The year to fetch data for.
     * @returns {Promise<EvolutionResponse>} - A promise that resolves to the evolution of the diagnosis code.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async codeEvolution(code: string, year: number = new Date().getFullYear()): Promise<EvolutionResponse> {
        const response: IRequesterResponse<EvolutionResponse> = await this.requester.get(`/chart/code_evolution?code=${code}&year=${year}`);
        
        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
