import { FeedbackRating } from "../../models/shared/FeedbackRating";
import { ChatMessageFeedbackProps } from "./ChatMessageFeedback";

export default function FeedbackedMessage(props: ChatMessageFeedbackProps) {
    const { message } = props;

    return (
        <div className="message-already-rated text-gray-500 font-italic">
            Este mensaje fue votado como{" "}
            {message.rating == FeedbackRating.SUCCESS
                ? "acertado"
                : "equivocado"}
        </div>
    );
}
