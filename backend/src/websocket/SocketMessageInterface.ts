
import { UUID } from "crypto";
import { MessageType } from "../messages/MessageType";

export default interface SocketMessageInterface{
    id:UUID;
    type:MessageType;
    content:any;
}