import { HTMLProps } from "react";
import { Link } from "react-router-dom";

export default function BackButton(
    props: { to: string } & HTMLProps<HTMLAnchorElement>
) {
    const { to, ...rest } = props;
    return (
        <Link className="back-button" to={to} {...rest}>
            <i
                className="bi bi-arrow-left-circle-fill"
                style={{ fontSize: "inherit", color: "inherit" }}
            ></i>
        </Link>
    );
}
