import { IncomingMessage } from "http";

import TokenValidatorInterface from "../auth/TokenValidator/TokenValidatorInterface";
import { ChatConfig } from "./ChatConfig";
import IncomingMessageParamRetriever from "../utils/IncomingMessageParamRetriever";
import { UUID } from "crypto";

export default class ChatConfigRetriever {

    tokenValidator: TokenValidatorInterface;
    paramRetriever: IncomingMessageParamRetriever | null;

    constructor(tokenValidator: TokenValidatorInterface) {
        this.tokenValidator = tokenValidator;
        this.paramRetriever = null;
    }

    private async getUserId(): Promise<UUID | null> {
        const token: string | null = this.paramRetriever!.retrieve("authorization");
        return (await this.tokenValidator.validate(token!))?.id || null;
    }

    private async getChatId(): Promise<UUID | null> {
        return await this.paramRetriever!.retrieve("chatId");
    }

    async getChatConfig(message: IncomingMessage): Promise<ChatConfig> {

        this.paramRetriever = new IncomingMessageParamRetriever(message);

        const userId = await this.getUserId();
        const chatId = await this.getChatId();

        return { ownerId: userId, chatId: chatId }
    }

}