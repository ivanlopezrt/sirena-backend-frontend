import AnswerMessage from "../messages/AnswerMessage";
import MessageInterface from "../messages/MessageInterface";
import { MessageType } from "../messages/MessageType";
import MessageService from "../services/MessageService";
import { ChatConfig } from "./ChatConfig";
import QuestionMessage from "../messages/QuestionMessage";
import EndMessage from "../messages/EndMessage";

export default class ChatMessageProcessor {

    private nonFinishedMessages: { [key: string]: MessageInterface[] };
    private messageService:MessageService;
    private chatConfig:ChatConfig;

    constructor(config:ChatConfig){
        this.chatConfig = config
        this.nonFinishedMessages = {};
        this.messageService  = new MessageService();
    }
    
    async process(message: MessageInterface) {

        switch (message.getType()) {
            case MessageType.ANSWER:
            case MessageType.PARTIAL_ANSWER:
                {
                    this.addMessageToNonFinished(message);
                    break;
                }

            case MessageType.QUESTION:
                {
                    await this.saveQuestion(message as QuestionMessage);
                    break;
                }
            
            case MessageType.END:
                await this.processEndMessage(message);
                break;

        }

    }

    private  addMessageToNonFinished(message: MessageInterface): void {
        this.nonFinishedMessages[message.getId()] = [...(this.nonFinishedMessages[message.getId()] || []), message];
    }

    private  async processEndMessage(message: MessageInterface): Promise<void> {
        switch(this.getFinishedMessageType(message)){
            case MessageType.ANSWER:
                await this.processEndAnswerMessage(message  as EndMessage);
        }

        this.finishMessage(message);

    }

    private  finishMessage(message:MessageInterface):void{
         delete this.nonFinishedMessages[message.getId()]
    }

    private  getFinishedMessageType(endMessage:MessageInterface):MessageType{
         if(this.nonFinishedMessages[endMessage.getId()] && this.nonFinishedMessages[endMessage.getId()][0]){
            return this.nonFinishedMessages[endMessage.getId()][0].getType();
        }
        return MessageType.UNKNOWN;
    }
    
    private async processEndAnswerMessage(endMessage: EndMessage){
        await this.saveAnswer(endMessage);
    }

    private async saveAnswer(endMessage: EndMessage):Promise<AnswerMessage>{
        const completeAnswerText = this.nonFinishedMessages[endMessage.getId()].map((message) => (message as AnswerMessage).getContent().text || "").join("");
        const mergedAnswer =  new AnswerMessage(endMessage.getId(),{text:completeAnswerText});

        await this.messageService.createMessage(this.chatConfig.ownerId!,this.chatConfig.chatId!,mergedAnswer.getId(),"assistant",mergedAnswer.getContent().text);
        return mergedAnswer;
    }

    private async saveQuestion(question: QuestionMessage):Promise<void>{
        await this.messageService.createMessage(this.chatConfig.ownerId!,this.chatConfig.chatId!,question.getId(),"user",question.getContent().question);
    }

}