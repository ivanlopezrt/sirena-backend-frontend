
import { MessageType } from "../messages/MessageType";
import { UUID } from "../shared/UUIDType";

export default interface SocketMessageInterface{
    id:UUID;
    type:MessageType;
    content:any;
}