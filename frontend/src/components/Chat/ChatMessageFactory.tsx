import { default as ChatMessageModel } from "../../models/ChatMessage";
import { MessageType } from "../../models/messages/MessageType";
import ChatMessage from "./ChatMessage";
import SystemMessage from "./SystemMessage";

export interface ChatMessageProps {
    message: ChatMessageModel;
}

export default function ChatMessageFactory(props: ChatMessageProps) {
    const { message } = props;
   
     const isSystemMessage = (message:ChatMessageModel) : boolean=>{
        return   message.role === "system" || message.type === MessageType.ERROR
     }

     return isSystemMessage(message) ? 
        <SystemMessage key={message.id} message={message} /> :
        <ChatMessage key={message.id} message={message} />
}