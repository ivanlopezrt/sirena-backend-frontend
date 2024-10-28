import { useState } from "react";
import ChartService, {
    EvolutionResponse,
    TopsByMonthResponse,
    TopsEverResponse,
} from "../services/ChartsService";
import { useQuery } from "@tanstack/react-query";
import useChartService, { TopSpecialityResponse } from "./useChartService";

export interface DiagnosisResult {
    name: string;
    data: number[];
}

export interface EvolutionCodeResult {
    [key: string]: EvolutionResponse;
}

/**
 * Custom hook to fetch chart data.
 * @returns {Object} The data for last days and top diagnoses by month.
 */
export default function useCharts() {
    const initialYearsToCompare = Array.from(
        { length: new Date().getFullYear() - 2023 },
        (_, i) => new Date().getFullYear() - i
    );
    const [daysForTopMonth, setDaysForTopMonth] = useState<number>(7);
    const [yearsEvolution, setYearsEvolution] = useState<number[]>(
        initialYearsToCompare
    );
    const [codeEvolution, setCodeEvolution] = useState<string>("");
    const service: ChartService = new ChartService();
    const { lastDaysDiagnosis, topsSpecialities } = useChartService();

    /**
     * Fetches data for the last days' diagnosis.
     * @returns {Object} The last days' diagnosis data and related status flags.
     */
    const { data: lastDaysData } = useQuery({
        queryKey: ["lastDaysDiagnosis"],
        queryFn: async () => {
            const data = await lastDaysDiagnosis();
            const counts = data.map((d) => d.count);
            const series = data.map((d) => d.code);
            return { data: counts, series: series };
        },
    });

    /**
     * Fetches top diagnoses by month based on the specified number of days.
     * @returns {Object} The tops by month data including diagnosis data, series, and dates.
     */
    const { data: topsByMonth } = useQuery({
        queryKey: ["topsByMonth", daysForTopMonth],
        queryFn: async () => {
            const data: TopsByMonthResponse = await service.topsByMonth();
            const dates = getLastestDates(daysForTopMonth).reverse(); // Reverse dates for proper alignment
            return {
                data: generateDiagnosisData(data, dates),
                series: data.tops,
                dates: dates,
            };
        },
    });

    /**
     * Fetches the top diagnoses ever with a limit.
     * @returns {TopsEverResponse[]} An array of the top diagnoses ever.
     */
    const { data: topsEver } = useQuery({
        queryKey: ["topsEver"],
        queryFn: async () => {
            const data: TopsEverResponse[] = await service.topsEver(20);
            return data;
        },
    });

    /**
     * Fetches the code evolution data for the selected years and code.
     * @returns {EvolutionCodeResult} The evolution data by year.
     */
    const { data: evolutionData } = useQuery({
        queryKey: ["evolutionData", yearsEvolution, codeEvolution],
        queryFn: async () => {
            let result: EvolutionCodeResult = {};

            if (codeEvolution) {
                for (let index = 0; index < yearsEvolution.length; index++) {
                    const year = yearsEvolution[index];
                    const evolution: EvolutionResponse =
                        await service.codeEvolution(codeEvolution, year);
                    result[year] = evolution;
                }
            }
            return result;
        },
    });

    /**
     * Fetches the top diagnoses by speciality.
     * @returns {TopSpecialityResponse} Object with data for each speciality.
     */
    const { data: topSpecialitiesData } = useQuery({
        queryKey: ["topsSpecialities"],
        queryFn: async () => {
            const data: TopSpecialityResponse = await topsSpecialities();
            return data;
        },
    });

    /**
     * Generates an array of formatted dates for the last specified number of days.
     * @param {number} daysToTake - The number of days to generate dates for (default is 30).
     * @returns {string[]} An array of formatted dates in the format dd/mm/yyyy.
     */
    const getLastestDates = (daysToTake: number = 30): string[] => {
        return Array.from({ length: daysToTake }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        });
    };

    /**
     * Generates diagnosis data grouped by code and formatted for chart display.
     * @param {TopsByMonthResponse} data - The response data containing diagnoses.
     * @param {string[]} days - The dates to consider for diagnosis totals (optional).
     * @returns {DiagnosisResult[]} An array of diagnosis results for chart display.
     */
    const generateDiagnosisData = (
        data: TopsByMonthResponse,
        days: string[] = []
    ): DiagnosisResult[] => {
        const diagnosisMap: { [code: string]: { [day: string]: number } } = {};

        if (!days || days.length === 0) {
            days = getLastestDates(30);
        }

        // Group diagnoses by code and day
        data.diagnoses.forEach((diagnosis) => {
            const { code, day, total } = diagnosis;
            if (!diagnosisMap[code]) {
                diagnosisMap[code] = {};
            }
            diagnosisMap[code][day] = total;
        });

        // Create the final output
        const result: DiagnosisResult[] = Object.keys(diagnosisMap).map(
            (code) => {
                const data = days.map((day) => diagnosisMap[code][day] || 0);
                return {
                    name: code,
                    data: data,
                };
            }
        );

        return result;
    };

    /**
     * Adds a new year to the yearsEvolution array if it doesn't already exist.
     * @param {number} year - The year to add.
     */
    const addYearsEvolution = (year: number) => {
        if (!yearsEvolution.includes(year)) {
            setYearsEvolution([...yearsEvolution, year]);
        }
    };

    return {
        lastDaysData,
        topsByMonth,
        topsEver,
        setDaysForTopMonth,
        evolutionData,
        yearsEvolution,
        setCodeEvolution,
        addYearsEvolution,
        codeEvolution,
        topSpecialitiesData,
    };
}
