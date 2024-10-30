import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import ChatMessage from "../models/ChatMessage";
import Feedback from "../models/Feedback";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing feedback related to chat messages.
 */
export default class FeedbackService {
    private requester: Requester;

    /**
     * Creates an instance of FeedbackService.
     */
    constructor() {
        this.requester = new Requester(new Authorizer(StoragerFactory.defaultStorager()));
    }

    /**
     * Sends feedback for a specific chat message.
     * 
     * @param {Feedback} feedback - The feedback object containing the chat ID, message ID, and other feedback data.
     * @returns {Promise<ChatMessage>} - A promise that resolves to the updated ChatMessage object after feedback has been sent.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async send(feedback: Feedback): Promise<ChatMessage> {
        const response: IRequesterResponse<ChatMessage> = await this.requester.post(
            `/chat/${feedback.chat_id}/message/${feedback.message_id}/feedback`,
            feedback
        );

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
