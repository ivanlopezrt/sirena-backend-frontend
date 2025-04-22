import { UUID } from "crypto";
import { MessageType } from "./MessageType";

export default interface MessageInterface{
    getId():UUID;
    getType():MessageType;
    getContent<T>():T;
    getTimeStamp():number;

}