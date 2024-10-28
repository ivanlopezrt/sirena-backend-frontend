import { Field, Form, Formik } from "formik";
import ChatMessage from "../../models/ChatMessage";
import { useChatContext } from "../../context/ChatProvider";
import { FeedbackRating } from "../../models/shared/FeedbackRating";
import { Gender } from "../../models/Gender";
import CodeExtractor from "../../services/CodeExtractor";
import toast from "react-hot-toast";

export interface MessageSaveModalProps {
    message: ChatMessage;
}

export default function MessageSaveModal(props: MessageSaveModalProps) {
    const { message } = props;
    const { diagnose, updateMessage } = useChatContext();

    const renderCodes = () => {
        return new CodeExtractor().extract(message.text).map((code) => {
            return (
                <span
                    key={code}
                    className="badge badge-exclusive badge-light-primary fw-semibold fs-6 px-2 py-1 ms-1"
                >
                    {code}
                </span>
            );
        });
    };

    return (
        <div
            className="modal fade"
            tabIndex={-1}
            id={`save_modal_for_${message.id}`}
        >
            <Formik
                initialValues={{ dni: "", gender: Gender.FEMALE }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    try {
                        let codes = new CodeExtractor().extract(message.text);
                        diagnose(message, {
                            dni: values.dni,
                            gender: values.gender,
                            diagnosis: codes,
                        });
                        message.saved = true;
                        updateMessage(message.id, message);

                        resetForm();
                    } catch {
                        toast.error("No se ha podido enviar el diagnóstico");
                    }
                }}
            >
                <Form className="">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    Datos de diagnóstico
                                </h3>

                                <div
                                    className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <i className="ki-duotone ki-cross fs-1">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                </div>
                            </div>

                            <div className="modal-body">
                                <p>
                                    Cuanta más información aportes mejores
                                    estadísticas podremos sacar
                                </p>

                                <div className="mb-10">
                                    <label
                                        htmlFor="rigth_prediction_value"
                                        className="required form-label"
                                    >
                                        Códigos identificados
                                    </label>

                                    <div>{renderCodes()}</div>
                                </div>

                                <div className="mb-10">
                                    <label
                                        htmlFor="rigth_prediction_value"
                                        className="form-label"
                                    >
                                        DNI
                                    </label>

                                    <Field
                                        className="form-control form-control-solid"
                                        data-kt-element="input"
                                        name="dni"
                                        placeholder="Ej: 01234567A"
                                    />
                                </div>

                                <div className="mb-10">
                                    <label
                                        htmlFor="rigth_prediction_value"
                                        className="required form-label"
                                    >
                                        Género
                                    </label>

                                    <Field
                                        as="select"
                                        name="gender"
                                        className="form-control form-control-solid"
                                    >
                                        <option value={Gender.MALE}>
                                            Hombre
                                        </option>
                                        <option value={Gender.FEMALE}>
                                            Mujer
                                        </option>
                                        <option value={Gender.OTHER}>
                                            Otro
                                        </option>
                                    </Field>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="submit"
                                    className="btn btn-light"
                                    data-bs-dismiss="modal"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
