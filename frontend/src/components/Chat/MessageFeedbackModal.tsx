import { Field, Form, Formik } from "formik";
import ChatMessage from "../../models/ChatMessage";
import { useChatContext } from "../../context/ChatProvider";
import { FeedbackRating } from "../../models/shared/FeedbackRating";

export interface MessageFeedbackModalProps {
    message: ChatMessage;
}

export default function MessageFeedbackModal(props: MessageFeedbackModalProps) {
    const { message } = props;
    const { feedback } = useChatContext();

    return (
        <div
            className="modal fade"
            tabIndex={-1}
            id={`prediction_modal_for_${message.id}`}
        >
            <Formik
                initialValues={{ code: "" }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (values.code) {
                        feedback(message, FeedbackRating.MISTAKE, values.code);
                        resetForm();
                    }
                }}
            >
                <Form className="">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    Ayúdanos a mejorar
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
                                    ¿Qué código debería haber devuelto el
                                    asistente para este mensaje?
                                </p>

                                <div className="mb-10">
                                    <label
                                        htmlFor="rigth_prediction_value"
                                        className="required form-label"
                                    >
                                        Código
                                    </label>

                                    <Field
                                        className="form-control form-control-solid"
                                        data-kt-element="input"
                                        name="code"
                                        placeholder="Ej: EAS-1001"
                                    />
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
