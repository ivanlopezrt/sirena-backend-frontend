import {default as ChatMessageModel} from "../../models/ChatMessage";

export interface ChatMessageProps {
    message: ChatMessageModel;
}

export default function SystemMessage(props: ChatMessageProps) {
    const {message} = props;

    return (
        <div className={`mb-12 system-message`}>
                <div
                    className={`p-5 rounded pre-wrap text-gray-900 fw-semibold`}
                    data-kt-element="message-text"
                >
                    { message.text}
                </div>
        </div>
    );
}
