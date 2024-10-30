export default function LoginBackground() {
    return (
        <div className="background-login-wrapper d-none d-lg-flex flex-lg-row-fluid w-50 ">
            <div
                className="background-login w-100 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
                style={{
                    backgroundImage: `url(${
                        process.env.REACT_APP_PUBLIC_URL +
                        "/media/auth/salud3.webp"
                    })`,
                }}
            ></div>
        </div>
    );
}
