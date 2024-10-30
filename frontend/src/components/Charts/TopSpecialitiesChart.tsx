import ChartBox from "./ChartBox";
import useCharts from "../../hooks/useCharts";
import PieChart from "./BaseCharts/PieChart";

export default function TopSpecialitiesChart() {
    const { topSpecialitiesData } = useCharts();

    if (!topSpecialitiesData) return <></>;

    return (
        <ChartBox>
            <ChartBox.Title>
                <span className="card-label fw-bold text-gray-800">
                    Top por especialidades
                </span>
                <span className="text-gray-500 mt-1 fw-semibold fs-6">
                    Gráfica de códigos por cada especialidad
                </span>
            </ChartBox.Title>
            <ChartBox.Chart>
                <div className="row">
                    {topSpecialitiesData.map((speciality, index) => (
                        <div
                            key={speciality.specialty}
                            className="col-xl-6  d-flex flex-column mt-12"
                            style={{ minHeight: "60vh" }}
                        >
                            <span className=" fw-bold text-gray-800 border-bottom mb-6">
                                {speciality.specialty}
                            </span>
                            <PieChart
                                containerId={"speciality_" + index}
                                valueFieldName={"total"}
                                categoryFieldName={"code"}
                                data={speciality.codes}
                            />
                        </div>
                    ))}
                </div>
            </ChartBox.Chart>
        </ChartBox>
    );
}
