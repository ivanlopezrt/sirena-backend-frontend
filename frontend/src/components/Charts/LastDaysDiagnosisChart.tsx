import useCharts from "../../hooks/useCharts";
import ApexChart from "./BaseCharts/ApexChart";
import ChartBox from "./ChartBox";

export default function LastDaysDiagnosisChart() {
    const { lastDaysData } = useCharts();

    if (!lastDaysData) return <></>;

    return (
        <ChartBox>
            <ChartBox.Title>
                <span className="card-label fw-bold text-gray-800">
                    Diagnósticos totales a 30 días
                </span>
                <span className="text-gray-500 mt-1 fw-semibold fs-6">
                    Mis diagnosticos de los últimos 30 dias
                </span>
            </ChartBox.Title>
            <ChartBox.Chart>
                <ApexChart
                    type="bar"
                    data={[{ name: "código", data: lastDaysData?.data || [] }]}
                    xAxis={lastDaysData?.series || []}
                />
            </ChartBox.Chart>
        </ChartBox>
    );
}
