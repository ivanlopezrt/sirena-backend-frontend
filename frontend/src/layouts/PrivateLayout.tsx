import { Outlet } from "react-router";
import Footer from "../components/Footer";
import MobileMenuButton from "../components/Common/MobileMenuButton";
import LoggedInUser from "../components/Common/LoggedInUser";
import Logo from "../components/Common/Logo";
import { Toaster } from "react-hot-toast";
import NaivgationMenu from "../components/Common/NavigationMenu";
import { useMenuDrawer } from "../context/MenuDrawerContext";
import DrawerOverlay from "../components/Common/DrawerOverlay";

export default function PrivateLayout() {
    const { opened } = useMenuDrawer();

    return (
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
            <Toaster />
            <div
                className="app-page flex-column flex-column-fluid"
                id="kt_app_page"
            >
                <div id="kt_app_header" className="app-header">
                    <div
                        className={`app-container container-fluid d-flex align-items-stretch justify-content-between`}
                        id="kt_app_header_container"
                    >
                        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                            <Logo />
                        </div>

                        <div
                            className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
                            id="kt_app_header_wrapper"
                        >
                            <div
                                className={`app-header-menu app-header-mobile-drawer align-items-stretch ${
                                    opened ? "drawer drawer-end drawer-on" : ""
                                }`}
                            >
                                <div
                                    className="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0"
                                    id="kt_app_header_menu"
                                    data-kt-menu="true"
                                >
                                    <NaivgationMenu />
                                </div>
                            </div>

                            <div className="app-navbar flex-shrink-0">
                                <div className="app-navbar-item ms-1 ms-md-4">
                                    <LoggedInUser />
                                </div>

                                <div
                                    className="app-navbar-item d-lg-none ms-2 me-n2"
                                    title="Show header menu"
                                >
                                    <MobileMenuButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="app-wrapper flex-column flex-row-fluid"
                    id="kt_app_wrapper"
                >
                    <div
                        className="app-main flex-column flex-row-fluid"
                        id="kt_app_main"
                    >
                        <div className="d-flex flex-column flex-column-fluid">
                            <div
                                id="kt_app_content"
                                className="app-content flex-column-fluid"
                            >
                                <div
                                    id="kt_app_content_container"
                                    className="app-container container-xxl h-100"
                                >
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                        {opened && <DrawerOverlay />}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
