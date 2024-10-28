import { useLocation, useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import BackButton from "../components/Common/BackButton";

export default function OTPPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, login } = useAuthContext();
    const { email } = location.state;

    const verify = async (code: string) => {
        await login(email, code);
    };

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [navigate, currentUser]);

    return (
        <Formik
            initialValues={{ code: "" }}
            onSubmit={async ({ code }) => {
                try {
                    await verify(code);
                } catch (err: unknown) {
                    toast.error((err as Error).message);
                }
            }}
        >
            <Form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
                <BackButton to="/public/auth/login" className="fs-1" />
                <div className="card-body">
                    <div className="text-start mb-10">
                        <h1
                            className="text-gray-900 mb-3 fs-3x"
                            data-kt-translate="sign-in-title"
                        >
                            Introduce el código que te ha llegado al email
                        </h1>
                        <div
                            className="text-gray-500 fw-semibold fs-6"
                            data-kt-translate="general-desc"
                        >
                            Verificación de acceso
                        </div>
                    </div>
                    <div className="fv-row mb-8 fv-plugins-icon-container">
                        <Field
                            placeholder="Código"
                            name="code"
                            type="text"
                            className="form-control form-control-solid"
                            autoComplete="off"
                        />
                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
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
                                Verificar
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
