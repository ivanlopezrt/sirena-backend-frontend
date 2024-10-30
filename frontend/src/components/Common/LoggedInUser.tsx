import { useAuthContext } from "../../context/AuthContext";
import NavbarButton from "../Navbar/NavbarButton";
import PublicImage from "../UI/PublicImage";

export default function LoggedInUser() {
    const { logout, currentUser } = useAuthContext();
    return (
        <NavbarButton>
            <NavbarButton.Button>
                <div className="cursor-pointer symbol symbol-35px">
                    <PublicImage
                        src="/media/avatars/blank.png"
                        className="rounded-3"
                        alt="user"
                    />
                </div>
            </NavbarButton.Button>

            <NavbarButton.SubMenu className="loggedin-dropdown">
                <div
                    className="menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                    data-kt-menu="true"
                >
                    <div className="menu-item px-3">
                        <div className="menu-content d-flex align-items-center px-3">
                            <div className="symbol symbol-50px me-5">
                                <PublicImage
                                    alt="Logo"
                                    src="/media/avatars/blank.png"
                                />
                            </div>

                            <div className="d-flex flex-column">
                                <div className="fw-bold d-flex align-items-center fs-5">
                                    {currentUser?.name}
                                </div>
                                <span className="fw-semibold text-muted fs-7">
                                    {currentUser?.specialty_name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="separator my-2"></div>

                    <div className="menu-item px-5">
                        <div onClick={logout} className="menu-link px-5">
                            Salir
                        </div>
                    </div>
                </div>
            </NavbarButton.SubMenu>
        </NavbarButton>
    );
}
