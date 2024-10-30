import { Field, Form, Formik } from "formik";
import { useChatContext } from "../../context/ChatProvider";
import Chat from "../../models/Chat";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Loading from "../UI/Loading";

export interface ChatProps {
    model: Chat;
}

export default function ChatWindow(props: ChatProps) {
    const { sendMessage, messages, chat, waitingAnswer } = useChatContext();
    const [isClient, setIsClient] = useState(false);
    const { currentUser } = useAuthContext();
    const scrollChatWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (scrollChatWindow.current) {
            scrollChatWindow.current.scrollTop =
                scrollChatWindow.current.scrollHeight;
        }
    }, [messages]);

    const addMessageToChat = (prompt: string) => {
        if (prompt && prompt.trim()) {
            sendMessage({
                id: crypto.randomUUID(),
                chat_id: chat?.id || "",
                userName: currentUser?.name || "",
                date: new Date(),
                role: "user",
                text: prompt,
                rateable: false,
                saved: false,
            });
        }
    };

    return (
        <div className="flex-lg-row-fluid ms-lg-12 ms-xl-12  h-100">
            <div className="card  h-100" id="kt_chat_messenger">
                <div className="card-header" id="kt_chat_messenger_header">
                    <div className="card-title">
                        <div className="d-flex justify-content-center flex-column me-3">
                            <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1">
                                Asistente
                            </span>
                            <div className="mb-0 lh-1">
                                <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
                                <span className="fs-7 fw-semibold text-muted">
                                    En linea
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="card-body"
                    id="kt_chat_messenger_body"
                    ref={scrollChatWindow}
                >
                    <div className="scroll-y me-n5 pe-5 h-lg-auto">
                        {isClient &&
                            messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                />
                            ))}
                    </div>
                </div>

                <Formik
                    initialValues={{ prompt: "" }}
                    onSubmit={(values, { resetForm }) => {
                        addMessageToChat(values.prompt);
                        resetForm();
                    }}
                >
                    <Form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
                        <div
                            className="card-footer pt-4"
                            id="kt_chat_messenger_footer"
                        >
                            <Field
                                as="textarea"
                                className="form-control form-control-flush mb-3"
                                data-kt-element="input"
                                name="prompt"
                                rows={1}
                                placeholder="Escribe tu consulta"
                            />

                            <div className="d-flex justify-content-end">
                                {!waitingAnswer ? (
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        id="send_message"
                                    >
                                        <span className="indicator-label">
                                            Enviar
                                        </span>
                                    </button>
                                ) : (
                                    <div style={{ width: "40px" }}>
                                        <Loading />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
