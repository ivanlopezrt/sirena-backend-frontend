import React, { useState } from "react";

export interface NavbarButtonProps {
    children: React.ReactNode;
}

function NavbarButton(
    props: React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
    const [hover, setHover] = useState<boolean>(false);
    const childrens = React.Children.toArray(props.children);
    const { className, ...rest } = props;

    //The component
    const ButtonComponent = childrens.find((i) => {
        return (i as JSX.Element).type === NavbarButton.Button;
    }) as React.ReactElement;
    const SubMenuComponent = childrens.find((i) => {
        return (i as JSX.Element).type === NavbarButton.SubMenu;
    }) as React.ReactElement;

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`navbar-button-container ${className}`}
            {...rest}
        >
            {ButtonComponent}
            {hover && SubMenuComponent}
            <span className="menu-arrow d-lg-none"></span>
        </div>
    );
}

NavbarButton.Button = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...rest } = props;
    return (
        <div className={`navbar-button-button ${className}`} {...rest}>
            {props.children}
        </div>
    );
};

NavbarButton.SubMenu = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...rest } = props;
    return (
        <div className={`navbar-button-submenu ${className}`} {...rest}>
            {props.children}
        </div>
    );
};

export default NavbarButton;
