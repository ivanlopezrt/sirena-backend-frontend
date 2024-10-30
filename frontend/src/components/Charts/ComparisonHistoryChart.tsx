import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useEffect, useRef, useState } from "react";
import useCharts from "../../hooks/useCharts";
import AutoCompleteInput from "../Common/AutoCompleteInput";
import DiagnosisCodeService from "../../services/DiagnosisCodeService";

type ChartData = {
    years: string[];
    data: { [key: string]: any; date: Date; value: number }[];
};

export default function ComparisonHistoryChart() {
    const rootRef = useRef<am5.Root | null>(null);
    const { codeEvolution, evolutionData, setCodeEvolution } = useCharts();
    const [chartData, setChartData] = useState<ChartData>();

    /**
     * Crea un array con todos los días de un año específico.
     * @param year - El año para el cual se generarán los días.
     * @returns Un array de strings con el formato 'DD/MM/YYYY'.
     */
    function getAllDaysOfYear(year: number): string[] {
        const days: string[] = [];

        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                days.push(
                    `${String(day).padStart(2, "0")}/${String(
                        month + 1
                    ).padStart(2, "0")}/${year}`
                );
            }
        }

        return days;
    }

    const parseDateString = (dateString: string): Date => {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    useEffect(() => {
        let filledWithEmptyDaysData: {
            years: string[];
            data: { [key: string]: any; date: Date; value: number }[];
        } = { years: [], data: [] };

        if (evolutionData) {
            Object.keys(evolutionData!).forEach((year: string) => {
                filledWithEmptyDaysData.years.push(year);

                filledWithEmptyDaysData.data =
                    filledWithEmptyDaysData.data.concat(
                        getAllDaysOfYear(parseInt(year)).map((day) => {
                            let valueForDay = Array.from(
                                evolutionData[year]
                            ).find((c: any) => c.day === day);
                            let data: {
                                [key: string]: any;
                                date: Date;
                                value: number;
                            } = {
                                date: parseDateString(day),
                                value: valueForDay ? valueForDay.total : 0,
                            };
                            data["date_" + year] =
                                parseDateString(day).getTime();
                            data["value_" + year] = valueForDay
                                ? valueForDay.total
                                : 0;
                            return data;
                        })
                    );
            });
        }

        setChartData(filledWithEmptyDaysData);
    }, [evolutionData]);

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.dispose();
        }

        if (codeEvolution) {
            rootRef.current = am5.Root.new("sirena_evolution_chart");

            var data = chartData?.data || [];

            // Set theme
            rootRef.current.setThemes([
                am5themes_Animated.new(rootRef.current),
            ]);

            // Create chart
            var chart = rootRef.current.container.children.push(
                am5xy.XYChart.new(rootRef.current, {
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX",
                })
            );

            // Add cursor
            var cursor = chart.set(
                "cursor",
                am5xy.XYCursor.new(rootRef.current, {
                    behavior: "none",
                })
            );
            cursor.lineY.set("visible", false);

            var yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(rootRef.current, {
                    maxDeviation: 1,
                    renderer: am5xy.AxisRendererY.new(rootRef.current, {
                        pan: "zoom",
                    }),
                })
            );

            chartData?.years.forEach((year) => {
                var xAxis = chart.xAxes.push(
                    am5xy.DateAxis.new(rootRef.current!, {
                        baseInterval: { timeUnit: "day", count: 1 },
                        renderer: am5xy.AxisRendererX.new(rootRef.current!, {}),
                        tooltip: am5.Tooltip.new(rootRef.current!, {}),
                        tooltipDateFormat: "yyyy-MM-dd",
                    })
                );

                // Add series
                var serieForYear = chart.series.push(
                    am5xy.LineSeries.new(rootRef.current!, {
                        name: "Series",
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: "value_" + year,
                        valueXField: "date_" + year,
                        tooltip: am5.Tooltip.new(rootRef.current!, {
                            labelText: "{valueY}",
                        }),
                    })
                );

                serieForYear.data.setAll(chartData.data);
                serieForYear.appear(1000);
            });

            // Add scrollbar
            var scrollbar = chart.set(
                "scrollbarX",
                am5xy.XYChartScrollbar.new(rootRef.current, {
                    orientation: "horizontal",
                    height: 60,
                })
            );

            var sbDateAxis = scrollbar.chart.xAxes.push(
                am5xy.DateAxis.new(rootRef.current, {
                    baseInterval: {
                        timeUnit: "day",
                        count: 1,
                    },
                    renderer: am5xy.AxisRendererX.new(rootRef.current, {}),
                })
            );

            var sbValueAxis = scrollbar.chart.yAxes.push(
                am5xy.ValueAxis.new(rootRef.current, {
                    renderer: am5xy.AxisRendererY.new(rootRef.current, {}),
                })
            );

            var sbSeries = scrollbar.chart.series.push(
                am5xy.LineSeries.new(rootRef.current, {
                    valueYField: "value_2024",
                    valueXField: "year_2024",
                    xAxis: sbDateAxis,
                    yAxis: sbValueAxis,
                })
            );

            sbSeries.data.setAll(data);

            // Make stuff animate on load
            chart.appear(1000, 100);
        }

        // Clean up on unmount
        return () => {
            if (rootRef.current) {
                rootRef.current.dispose();
            }
        };
    }, [chartData, rootRef, codeEvolution]);

    return (
        <>
            <AutoCompleteInput
                filter={async (query: string) => {
                    let codes = await new DiagnosisCodeService().find(query);
                    return codes.map((code) => {
                        return {
                            option: code.code + ":  " + code.description,
                            value: code.code,
                        };
                    });
                }}
                onSelect={(option) => {
                    setCodeEvolution(option.value);
                }}
            />

            {!codeEvolution ? (
                <div className="no_code_evolution">Seleccione un código</div>
            ) : (
                <>
                    <div
                        id="chartcontrols"
                        style={{ height: "auto", padding: "5px 45px 0 15px" }}
                    ></div>
                    <div
                        id="sirena_evolution_chart"
                        style={{ width: "100%", height: "500px" }}
                    ></div>
                </>
            )}
        </>
    );
}
