import React from "react";

export default function PublicImage(
    props: React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    >
) {
    return (
        <img
            {...props}
            alt={props.alt}
            src={`${process.env.REACT_APP_PUBLIC_URL}${props.src}`}
        />
    );
}
