import ChartBox from "./ChartBox";
import useCharts from "../../hooks/useCharts";
import PieChart from "./BaseCharts/PieChart";

export default function TopsHistoryChart() {
    const { topsEver } = useCharts();

    if (!topsEver) return <></>;

    return (
        <ChartBox>
            <ChartBox.Title>
                <span className="card-label fw-bold text-gray-800">
                    Mi top histórico
                </span>
                <span className="text-gray-500 mt-1 fw-semibold fs-6">
                    Total de diagnósticos por mi usuario
                </span>
            </ChartBox.Title>
            <ChartBox.Chart>
                <PieChart
                    containerId="top_history"
                    valueFieldName={"total"}
                    categoryFieldName={"code"}
                    data={topsEver}
                />
            </ChartBox.Chart>
        </ChartBox>
    );
}
