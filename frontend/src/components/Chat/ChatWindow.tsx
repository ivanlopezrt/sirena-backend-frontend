import {Field, Form, Formik} from "formik";
import {useChatContext} from "../../context/ChatProvider";
import Chat from "../../models/Chat";
import ChatMessage from "./ChatMessage";
import {useEffect, useRef, useState} from "react";
import {useAuthContext} from "../../context/AuthContext";
import Loading from "../UI/Loading";
import { CONNECTION_STATE } from "../../hooks/useWebSocketChat";
import { stat } from "fs";
import ChatAssistantStatus from "./ChatAssistantStatus";
import { MessageType } from "../../models/messages/MessageType";
import ChatMessageFactory from "./ChatMessageFactory";

export interface ChatProps {
    model: Chat;
}

export default function ChatWindow(props: ChatProps) {
    const {sendMessage, messages, chat, waitingAnswer,status, connectionState} = useChatContext();
    const [isClient, setIsClient] = useState(false);
    const {currentUser} = useAuthContext();
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
                alternative_text: null,
                status:"",
                type:MessageType.QUESTION
            });
        }
    };

    return (
        <div className="flex-lg-row-fluid ms-lg-12 ms-xl-12  h-100">
            <div className="card  h-100" id="kt_chat_messenger">
                <div className="card-header" id="kt_chat_messenger_header">
                    <div className="card-title">
                       <ChatAssistantStatus />
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
                                <ChatMessageFactory message={message} />
                            ))}
                    </div>
                </div>

                <Formik
                    initialValues={{prompt: ""}}
                    onSubmit={(values, {resetForm}) => {
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
                                {!waitingAnswer && status.allowQuestions && connectionState === CONNECTION_STATE.CONNECTED? (
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
                                    <div style={{width: "40px"}}>
                                        <Loading/>
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
