import { UUID } from "crypto";

const {Chat, Message, Feedback} = require('../models');

/**
 * messageService gestiona los mensajes dentro de los chats, permitiendo su recuperación, creación e integración de comentarios.
 */
export default class MessageService {

    /**
     * Recupera los mensajes para un chat dado, opcionalmente paginados, incluyendo retroalimentación si es aplicable.
     * @async
     * @param {UUID} req_user_id - El ID del usuario que hace la solicitud para garantizar el acceso al chat.
     * @param {UUID} chat_id - El ID del chat desde el que se recuperan los mensajes.
     * @param {number} [page] - Número de página opcional para la paginación.
     * @returns {Promise<Array<Object>>} - Un array de objetos de mensaje, incluyendo retroalimentación y calificación si están disponibles.
     */
    async getMessages(req_user_id: UUID, chat_id: UUID, page?: number): Promise<Array<any>> {

        let filter: { limit?: number, offset?: number } = {};
        const pageSize = 100;

        if (page) {
            filter = {
                limit: 100,
                offset: (page - 1) * pageSize
            };
        }

        if (chat_id) {
            const chat = await Chat.findOne({ where: { id: chat_id, user_id: req_user_id } });

            if (chat) {

                const messages = await Message.findAll({
                    where: { chat_id: chat_id },
                    order: [['date', 'DESC'], ['id', 'DESC']],
                    ...filter
                });

                const messagesWithFeedback = await Promise.all(messages.map(async (message:any) => {
                    if (message?.rateable) {
                        const feedback = await Feedback.findOne({ where: { message_id: message.id } });
                        if (feedback) {
                            message = feedback.rating === "mistake" ? {
                                ...message.toJSON(),
                                feedback: feedback.feedback,
                                rating: feedback.rating
                            } : {
                                ...message.toJSON(),
                                rating: feedback.rating
                            };
                        }
                    }
                    return message;
                }));

                return messagesWithFeedback;
            }
        }

        return [];
    }

    /**
     * Crea un mensaje dentro de un chat. Crea el chat si no existe.
     * @async
     * @param {UUID} req_user_id - El ID del usuario que está creando el mensaje.
     * @param {UUID} chat_id - El ID del chat al que se añade el mensaje.
     * @param {UUID} message_id - El ID del mensaje a crear.
     * @param {string} role - El rol del remitente, puede ser 'user' o 'assistant'.
     * @param {string} text - El texto del mensaje.
     * @returns {Promise<Object>} - Un objeto que contiene el código de respuesta y el mensaje creado.
     */
    async createMessage(req_user_id: UUID, chat_id: UUID, message_id: UUID, role: "user"|"assistant", text: string): Promise<{ code: number, message: string | object }> {

        if (!(text && text.trim() !== "")) {
            return { code: 400, message: "El texto del mensaje está vacío" };
        }

        if (!(role && role.trim() !== "" && (role === "user" || role === "assistant"))) {
            return { code: 400, message: "Se necesita un rol válido" };
        }

        if (!chat_id) {
            return { code: 400, message: "Se necesita un chat_id válido" };
        }

        let chat = await Chat.findOne({ where: { id: chat_id } });

        if (!chat) {
            chat = await Chat.create({
                id: chat_id,
                user_id: req_user_id,
                title: text,
                creation_date: new Date()
            });

            if (!chat) {
                return { code: 500, message: "Falló al crear el mensaje" };
            }

        } else if (chat.dataValues.user_id !== req_user_id) {
            return { code: 403, message: "No puedes añadir un mensaje a este chat" };
        }

        const findMessage = await Message.findOne({
            where: {
                id: message_id,
                chat_id: chat_id
            }
        });

        if (findMessage) {
            console.log({ code: 200, message: findMessage.toJSON() })
            return { code: 200, message: findMessage.toJSON() };
        }

        const createdMessage = await Message.create({
            id: message_id,
            chat_id: chat_id,
            role: role,
            text: text,
            rateable: role === "user" ? false : true,
            date: new Date()
        });

        if (!createdMessage) {
            return { code: 500, message: "Falló al crear el mensaje" };
        }

        console.log({ code: 200, message: createdMessage.toJSON() })
        return { code: 200, message: createdMessage.toJSON() };

    }

}

