import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div id="kt_app_footer" className="app-footer">
            <div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                <div className="text-gray-900 order-2 order-md-1">
                    <span className="text-muted fw-semibold me-1">
                        2024&copy;
                    </span>
                    <span className="text-gray-800 text-hover-primary">
                        Proyecto Sirena
                    </span>
                    ||
                    <Link
                        target="_blank"
                        className="text-gray-800 text-hover-primary"
                        to={"/public/contact"}
                    >
                        Contacto
                    </Link>
                </div>

                <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                    <li className="menu-item">
                        <a
                            href="https://riberadeltajo.es/"
                            target="_blank"
                            className="menu-link px-2"
                            rel="noreferrer"
                        >
                            IES Ribera del Tajo
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://lenguajenatural.ai/"
                            target="_blank"
                            className="menu-link px-2"
                            rel="noreferrer"
                        >
                            LenguajeNatural.AI
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://www.meytel.net/"
                            target="_blank"
                            className="menu-link px-2"
                            rel="noreferrer"
                        >
                            Meytel
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
