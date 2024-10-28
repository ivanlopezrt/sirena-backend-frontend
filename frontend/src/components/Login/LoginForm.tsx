import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { ResponseCodes } from "../../models/shared/ResponseCodes";
import OTPRequester from "../../auth/impl/OTPRequester";
import IOTPRequester from "../../auth/IOTPRequester";
import Loading from "../UI/Loading";
import toast from "react-hot-toast";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const auth = async (email: string, password: string) => {
        try {
            const otpRequester: IOTPRequester = new OTPRequester();
            setLoading(true);
            const result = await otpRequester.request(email, password);

            setLoading(false);

            if (result.code == ResponseCodes.OK) {
                navigate("/public/auth/otp", { state: { email: email } });
            }
        } catch (err: unknown) {
            setLoading(false);
            toast.error("No se ha podido enviar el código de verificación");
        }
    };

    return loading ? (
        <div>
            <Loading />
        </div>
    ) : (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async ({ email, password }) => {
                if (email && password) {
                    auth(email, password);
                }
            }}
        >
            <Form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
                <div className="card-body">
                    <div className="text-start mb-10">
                        <h1
                            className="text-gray-900 mb-3 fs-3x  mb-12"
                            data-kt-translate="sign-in-title"
                        >
                            Proyecto Sirena
                        </h1>
                        <h2>Iniciar sesión</h2>
                        <div
                            className="text-gray-500 fw-semibold fs-6"
                            data-kt-translate="general-desc"
                        >
                            Accede al sistema de identificación de diagnósticos
                        </div>
                    </div>
                    <div className="fv-row mb-8 fv-plugins-icon-container">
                        <Field
                            placeholder="Email"
                            name="email"
                            required={true}
                            type="email"
                            className="form-control form-control-solid"
                            autoComplete="off"
                        />
                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                    </div>
                    <div className="fv-row mb-7 fv-plugins-icon-container">
                        <Field
                            placeholder="Contraseña"
                            name="password"
                            required={true}
                            type="password"
                            className="form-control form-control-solid"
                            autoComplete="off"
                        />
                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                    </div>
                    <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-10">
                        <div></div>
                        <Link to={"/public/contact"}>Solicitar acceso</Link>
                    </div>
                    <div className="d-flex flex-stack">
                        <button
                            type="submit"
                            id="kt_sign_in_submit"
                            className="btn btn-primary me-2 flex-shrink-0"
                        >
                            <span
                                className="indicator-label"
                                data-kt-translate="sign-in-submit"
                            >
                                Entrar
                            </span>
                            <span className="indicator-progress">
                                <span data-kt-translate="general-progress">
                                    Please wait...
                                </span>
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </Form>
        </Formik>
    );
}
