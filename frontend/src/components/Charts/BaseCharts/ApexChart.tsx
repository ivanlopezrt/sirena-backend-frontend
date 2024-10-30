import Chart from "react-apexcharts";

export interface ApexChartProps {
    data: any[];
    xAxis: string[];
    showLegend?: boolean;
    dataLabelsEnabled?: boolean;
    type:
        | "area"
        | "line"
        | "bar"
        | "pie"
        | "donut"
        | "radialBar"
        | "scatter"
        | "bubble"
        | "heatmap"
        | "candlestick"
        | "boxPlot"
        | "radar"
        | "polarArea"
        | "rangeBar"
        | "rangeArea"
        | "treemap"
        | undefined;
}

export default function ApexChart(props: ApexChartProps) {
    const { data, xAxis, type, showLegend, dataLabelsEnabled } = props;

    return (
        <Chart
            options={{
                chart: {
                    fontFamily: "inherit",
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {},
                legend: {
                    show: showLegend || true,
                },
                dataLabels: {
                    enabled: dataLabelsEnabled || false,
                },
                fill: {
                    type: "solid",
                    opacity: 0.2,
                },
                stroke: {
                    curve: "smooth",
                },
                xaxis: {
                    categories: xAxis,
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        style: {
                            colors: "orange",
                            fontSize: "12px",
                        },
                    },
                    crosshairs: {
                        position: "front",
                        stroke: {
                            color: "red",
                            width: 1,
                            dashArray: 3,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        formatter: undefined,
                        offsetY: 0,
                        style: {
                            fontSize: "12px",
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "blue",
                            fontSize: "12px",
                        },
                    },
                },
                states: {
                    normal: {
                        filter: {
                            type: "none",
                            value: 0,
                        },
                    },
                    hover: {
                        filter: {
                            type: "none",
                            value: 0,
                        },
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: "none",
                            value: 0,
                        },
                    },
                },
                tooltip: {
                    style: {
                        fontSize: "12px",
                    },
                    y: {
                        formatter: function (val) {
                            return val + " veces diagnosticado";
                        },
                    },
                },
                grid: {
                    borderColor: "purple",
                    strokeDashArray: 4,
                    yaxis: {
                        lines: {
                            show: true,
                        },
                    },
                },
            }}
            series={data}
            type={type}
            width="100%"
            height="100%"
        />
    );
}
