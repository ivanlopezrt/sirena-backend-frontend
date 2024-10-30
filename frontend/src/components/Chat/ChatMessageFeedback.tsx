import { useChatContext } from "../../context/ChatProvider";
import ChatMessage from "../../models/ChatMessage";
import { FeedbackRating } from "../../models/shared/FeedbackRating";
import CodeExtractor from "../../services/CodeExtractor";
import MessageFeedbackModal from "./MessageFeedbackModal";
import MessageSaveModal from "./MessageSaveModal";

export interface ChatMessageFeedbackProps {
    message: ChatMessage;
}

export default function ChatMessageFeedback(props: ChatMessageFeedbackProps) {
    const { message } = props;
    const { feedback } = useChatContext();

    const successFeedback = () => {
        feedback(message, FeedbackRating.SUCCESS, "");
    };

    const answerHasCodes = () => {
        return new CodeExtractor().extract(props.message.text).length > 0;
    };

    return (
        <>
            <div className="assist-feedback-container mt-2 d-flex align-items-center">
                {!message.saved && answerHasCodes() && (
                    <button
                        data-bs-toggle="modal"
                        data-bs-target={`#save_modal_for_${message.id}`}
                        className="btn btn-sm btn-icon btn-active-light-primary"
                        type="button"
                        aria-label="Guardar diagnóstico"
                        data-bs-original-title="Guardar diagnóstico"
                    >
                        <i className="bi bi-floppy"></i>
                    </button>
                )}
                {!message.rating && (
                    <>
                        <button
                            onClick={() => {
                                successFeedback();
                            }}
                            className="btn btn-sm btn-icon btn-active-light-success"
                            type="button"
                            data-bs-toggle="tooltip"
                            aria-label="La respuesta es correcta"
                            data-bs-original-title="La respuesta es correcta"
                        >
                            <i className="ki-duotone ki-like">
                                <span className="path1"></span>
                                <span className="path2"></span>
                            </i>
                        </button>
                        <button
                            data-bs-toggle="modal"
                            data-bs-target={`#prediction_modal_for_${message.id}`}
                            className="btn btn-sm btn-icon btn-active-light-danger"
                            type="button"
                            aria-label="La respuesta es incorrecta"
                            data-bs-original-title="La respuesta es incorrecta"
                        >
                            <i className="ki-duotone ki-dislike">
                                <span className="path1"></span>
                                <span className="path2"></span>
                            </i>
                        </button>
                    </>
                )}
            </div>
            <MessageFeedbackModal message={message} />
            <MessageSaveModal message={message} />
        </>
    );
}
