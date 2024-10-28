import ChatMessageFeedback from "./ChatMessageFeedback";
import AssistantAvatar from "../Common/AssistantAvatar";
import UserAvatar from "../Common/UserAvatar";
import { default as ChatMessageModel } from "../../models/ChatMessage";
import FeedbackedMessage from "./FeedbackedMessage";

export interface ChatMessageProps {
    message: ChatMessageModel;
}

export default function ChatMessage(props: ChatMessageProps) {
    const { message } = props;

    const align = () => {
        return message.role == "assistant"
            ? "justify-content-start"
            : "justify-content-end";
    };

    const color = () => {
        return message.role == "assistant" ? "" : "bg-light-primary";
    };

    const aligntext = () => {
        return message.role == "assistant" ? "" : "flex-row-reverse text-end";
    };

    const alignRow = () => {
        return message.role == "assistant"
            ? "align-items-start"
            : "align-items-end";
    };

    return (
        <div className={`d-flex  mb-10 ${align()}`}>
            <div className={`d-flex flex-column ${alignRow()}`}>
                <div className={`d-flex  mb-2 ${aligntext()}`}>
                    <div className="symbol symbol-35px symbol-circle">
                        {message.role == "assistant" ? (
                            <AssistantAvatar />
                        ) : (
                            <UserAvatar />
                        )}
                    </div>

                    <div className={`d-flex ms-3 flex-column`}>
                        <span className="fs-5 fw-bold text-gray-900 text-hover-primary me-1">
                            {message.role === "assistant" ? "Asistente" : "Tú"}
                        </span>
                        <span
                            className="text-muted small mb-1"
                            suppressHydrationWarning
                        >
                            {new Date(message.date).toLocaleDateString()}{" "}
                            {new Date(message.date).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div
                    className={`p-5 rounded   text-gray-900 fw-semibold mw-lg-400px text-start ${color()}`}
                    data-kt-element="message-text"
                >
                    {message.text}
                    {message.rateable && (
                        <ChatMessageFeedback message={message} />
                    )}
                    {message.rating && <FeedbackedMessage message={message} />}
                </div>
            </div>
        </div>
    );
}
