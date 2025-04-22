import { UUID } from "crypto";

export interface QuestionMessageData{
    messageId:UUID|null;
    question:string;
}