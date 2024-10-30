import ComparisonHistoryChart from "../components/Charts/ComparisonHistoryChart";
import LastDaysDiagnosisChart from "../components/Charts/LastDaysDiagnosisChart";
import TopsByMonthChart from "../components/Charts/TopsByMonthChart";
import TopsHistoryChart from "../components/Charts/TopsHistoryChart";
import TopSpecialitiesChart from "../components/Charts/TopSpecialitiesChart";

export default function Dashboard() {
    return (
        <>
            <div className="row mb-6" style={{ minHeight: "60vh" }}>
                <div className="col-xl-7 my-top-diag-chart">
                    <TopsByMonthChart />
                </div>

                <div className="col-xl-5 my-top-history-chart">
                    <TopsHistoryChart />
                </div>
            </div>

            <div className="row mb-6" style={{ height: "60vh" }}>
                <div className="col-xl-12">
                    <LastDaysDiagnosisChart />
                </div>
            </div>

            <div className="row mb-6">
                <div className="col-xl-12">
                    <div className="card card-flush h-md-100">
                        <div className="card-header pt-7">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-gray-800">
                                    Comparativa histórica
                                </span>
                                <span className="text-gray-500 mt-1 fw-semibold fs-6">
                                    Evolución de un código de diagnóstico en
                                    diferentes años
                                </span>
                            </h3>
                        </div>
                        <div className="card-body pt-6">
                            <ComparisonHistoryChart />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ minHeight: "60vh" }}>
                <div className="col-xl-12">
                    <TopSpecialitiesChart />
                </div>
            </div>
        </>
    );
}
