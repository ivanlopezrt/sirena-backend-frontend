import {Field, Form, Formik} from "formik";
import ChatMessage from "../../models/ChatMessage";
import {useChatContext} from "../../context/ChatProvider";
import {FeedbackRating} from "../../models/shared/FeedbackRating";
import {Gender} from "../../models/Gender";
import CodeExtractor from "../../services/CodeExtractor";
import toast from "react-hot-toast";
import {useEffect, useRef, useState} from "react";

export interface MessageEditModalProps {
    message: ChatMessage;
}

export default function MessageEditModal(props: MessageEditModalProps) {
    const {message} = props;
    const {editResponseMessage, updateMessage} = useChatContext();
    const closeButton = useRef<HTMLButtonElement>(null);

    return (
        <div
            className="modal fade"
            tabIndex={-1}
            id={`edit_modal_for_${message.id}`}
        >
            <Formik
                initialValues={{response: message.text}}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    if (values.response.trim() === "") {
                        toast.error("El mensaje esta vacio");
                        return;
                    }

                    try {
                        message.alternative_text = values.response;
                        editResponseMessage(message);
                        updateMessage(message.id, message);

                        if (closeButton.current) {
                            closeButton.current.click();
                        }

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


                            </div>

                            <div className="modal-body">
                                <p>
                                    Modifica el texto e inserta la respuesta que el asistene debería haber
                                    proporcionado.
                                </p>


                                <div className="mb-10">
                                    <label
                                        htmlFor="rigth_prediction_value"
                                        className="required form-label"
                                    >
                                        Respuesta
                                    </label>

                                    <Field
                                        as="textarea"
                                        name="response"
                                        className="form-control form-control-solid"
                                        required
                                        placeholder="Escribe la respuesta aquí..."

                                        rows={8}
                                    />

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    ref={closeButton}
                                    type="button"
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
