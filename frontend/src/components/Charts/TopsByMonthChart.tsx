import useCharts from "../../hooks/useCharts";
import ApexChart from "./BaseCharts/ApexChart";
import ChartBox from "./ChartBox";

export default function TopsByMonthChart() {
    const { topsByMonth } = useCharts();

    if (!topsByMonth) {
        return <></>;
    }

    return (
        <ChartBox>
            <ChartBox.Title>
                <span className="card-label fw-bold text-gray-800">
                    Mi top diagnósticos: 30 días
                </span>
                <span className="text-gray-500 mt-1 fw-semibold fs-6">
                    Evolución diagnósticos por mi usuario
                </span>
            </ChartBox.Title>
            <ChartBox.Chart>
                <ApexChart
                    type="area"
                    data={topsByMonth?.data}
                    xAxis={topsByMonth?.dates}
                />
            </ChartBox.Chart>
        </ChartBox>
    );
}
