import { UUID } from "crypto";

export interface QuestionMessageData{
    messageId:UUID|null;
    question:string;
    history?:{role: string, content:string}[]
}