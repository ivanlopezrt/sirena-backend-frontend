import React from "react";

export interface NavbarButtonProps {
    children: React.ReactNode;
}

function ChartBox(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    const childrens = React.Children.toArray(props.children);
    const { className, ...rest } = props;

    //The component
    const TitleComponent = childrens.find((i) => {
        return (i as JSX.Element).type === ChartBox.Title;
    }) as React.ReactElement;
    const ChartComponent = childrens.find((i) => {
        return (i as JSX.Element).type === ChartBox.Chart;
    }) as React.ReactElement;

    return (
        <div className="card card-flush h-100">
            <div className="card-header pt-7">
                <h3 className="card-title align-items-start flex-column">
                    {TitleComponent}
                </h3>
            </div>
            <div className="card-body pt-6 h-100">{ChartComponent}</div>
        </div>
    );
}

ChartBox.Title = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...rest } = props;
    return <>{props.children}</>;
};

ChartBox.Chart = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...rest } = props;
    return <>{props.children}</>;
};

export default ChartBox;
