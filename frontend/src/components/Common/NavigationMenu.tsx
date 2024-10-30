import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import NavbarButton from "../Navbar/NavbarButton";
import { Role } from "../../models/Role";

export default function NaivgationMenu() {
    const { currentUser } = useAuth();

    return (
        <>
            <NavbarButton className="menu-item menu-here-bg menu-lg-down-accordion me-0 me-lg-2">
                <NavbarButton.Button className="menu-link">
                    <Link to="/" className="menu-link">
                        <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded me-1">
                            <i className="ki-duotone ki-element-11 text-success fs-1">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                            </i>
                        </span>
                        <span className="menu-title">Inicio</span>
                    </Link>
                </NavbarButton.Button>
            </NavbarButton>

            {currentUser && currentUser.role_name === Role.ADMIN && (
                <NavbarButton className="menu-item menu-here-bg menu-lg-down-accordion me-0 me-lg-2">
                    <NavbarButton.Button className="menu-link">
                        <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded me-1">
                            <i className="ki-duotone ki-setting-2  text-warning fs-1">
                                <span className="path1"></span>
                                <span className="path2"></span>
                            </i>
                        </span>
                        <span className="menu-title">Administración</span>
                        <span className="menu-arrow d-lg-none"></span>
                    </NavbarButton.Button>
                    <NavbarButton.SubMenu className="admin-menu">
                        <div
                            className="menu-state-bg menu-extended overflow-hidden overflow-lg-visible"
                            data-kt-menu-dismiss="true"
                        >
                            <div className="row">
                                <div className="col-lg-12 mb-3 mb-lg-0 py-3 px-3 py-lg-6 px-lg-6">
                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <div className="menu-item p-0 m-0">
                                                <Link
                                                    to="/users"
                                                    className="menu-link"
                                                >
                                                    <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                        <i className="bi bi-person-badge-fill text-danger fs-1"></i>
                                                    </span>
                                                    <span className="d-flex flex-column">
                                                        <span className="fs-6 fw-bold text-gray-800">
                                                            Profesionales
                                                        </span>
                                                        <span className="fs-7 fw-semibold text-muted">
                                                            Usuarios del sistema
                                                        </span>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <div className="menu-item p-0 m-0">
                                                <Link
                                                    to="/hospitals"
                                                    className="menu-link"
                                                >
                                                    <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                        <i className="bi bi-hospital text-info fs-1"></i>
                                                    </span>
                                                    <span className="d-flex flex-column">
                                                        <span className="fs-6 fw-bold text-gray-800">
                                                            Hospitales
                                                        </span>
                                                        <span className="fs-7 fw-semibold text-muted">
                                                            Centros sanitarios
                                                        </span>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <div className="menu-item p-0 m-0">
                                                <Link
                                                    to="/codes"
                                                    className="menu-link"
                                                >
                                                    <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                        <i className="bi bi-hospital text-warning fs-1"></i>
                                                    </span>
                                                    <span className="d-flex flex-column">
                                                        <span className="fs-6 fw-bold text-gray-800">
                                                            Códigos
                                                        </span>
                                                        <span className="fs-7 fw-semibold text-muted">
                                                            Listado de códigos
                                                        </span>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NavbarButton.SubMenu>
                </NavbarButton>
            )}

            <NavbarButton className="menu-item menu-here-bg menu-lg-down-accordion me-0 me-lg-2">
                <NavbarButton.Button className="menu-link btn btn-primary">
                    <Link to="/chat" className="menu-title text-light">
                        <span className="menu-custom-icon d-flex flex-center flex-shrink-0 rounded me-1">
                            <i className="bi bi-chat-dots fs-1"></i>
                        </span>
                        Asistente
                    </Link>
                </NavbarButton.Button>
            </NavbarButton>
        </>
    );
}
