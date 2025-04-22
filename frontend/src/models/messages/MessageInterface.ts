
import { UUID } from "../shared/UUIDType";
import { MessageType } from "./MessageType";

export default interface MessageInterface{
    getId():UUID;
    getType():MessageType;
    getContent<T>():T;
    getTimeStamp():number;

}