import { Outlet } from "react-router";
import PublicImage from "../components/UI/PublicImage";
import { Link } from "react-router-dom";
import LoginBackground from "../components/Login/LoginBackground";
import { Toaster } from "react-hot-toast";

export default function PublicLayout() {
    return (
        <div className="d-flex flex-column flex-root" id="kt_app_root">
            <Toaster />
            <div className="d-flex flex-column flex-lg-row flex-column-fluid">
                <Link to="/" className="d-block d-lg-none mx-auto py-20">
                    <PublicImage
                        alt="Logo"
                        src="/media/logos/logosirena.png"
                        className="theme-light-show h-25px"
                    />
                </Link>

                <div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
                    <div className="d-flex justify-content-center flex-column-fluid flex-column w-100 mw-450px">
                        <div className="py-20">
                            <Outlet />
                        </div>
                    </div>
                </div>

                <div className="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat">
                    <LoginBackground />
                </div>
            </div>
        </div>
    );
}
