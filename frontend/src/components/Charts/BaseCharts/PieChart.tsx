import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as amp5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export interface PieChartProps {
    data: any[];
    valueFieldName: string;
    categoryFieldName: string;
    containerId: string;
    isDoughnut?: boolean;
}

export default function PieChart(props: PieChartProps) {
    const rootRef = useRef<am5.Root | null>(null);
    const containerIdRef = useRef<string | null>();
    const { containerId, isDoughnut } = props;
    const [legendVisible, setLegendVisible] = useState<boolean>(false);

    const maybeDisposeRoot = (containerId: string) => {
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root.dom.id === containerId) {
                root.dispose();
            }
        });
    };

    useEffect(() => {
        if (!containerIdRef.current) {
            containerIdRef.current = containerId;
        }

        if (rootRef.current) {
            rootRef.current.dispose();
        }

        maybeDisposeRoot(containerIdRef.current);

        rootRef.current = am5.Root.new(containerIdRef.current);

        rootRef.current.setThemes([am5themes_Animated.new(rootRef.current)]);

        let chart = rootRef.current.container.children.push(
            amp5percent.PieChart.new(rootRef.current, {
                layout: rootRef.current.verticalLayout,
                innerRadius: isDoughnut ? am5.percent(50) : undefined,
            })
        );

        var series = chart.series.push(
            amp5percent.PieSeries.new(rootRef.current, {
                alignLabels: true,
                calculateAggregates: true,
                valueField: props.valueFieldName,
                categoryField: props.categoryFieldName,
            })
        );

        series.slices.template.setAll({
            strokeWidth: 3,
            stroke: am5.color(0xffffff),
        });

        //series.labels.template.set("forceHidden", true);

        series.data.setAll(props.data);

        var legend = chart.children.push(
            am5.Legend.new(rootRef.current, {
                centerX: am5.p50,
                x: am5.p50,
                marginTop: 15,
                marginBottom: 15,
            })
        );

        if (legendVisible) {
            legend.data.setAll(series.dataItems);
        }

        // Clean up on unmount
        return () => {
            if (rootRef.current) {
                rootRef.current.dispose();
            }
        };
    }, [rootRef, legendVisible]);

    return (
        <>
            <div
                title={"Mostrar/ocultar leyenda"}
                className="toggle-legend d-flex flex-end text-hover-primary cursor-pointer"
                onClick={() => {
                    setLegendVisible(!legendVisible);
                }}
            >
                <i className="fs-3 bi bi-file-earmark-spreadsheet"></i>
            </div>
            <div
                id={containerId}
                style={{ width: "100%", height: "100%" }}
            ></div>
        </>
    );
}
