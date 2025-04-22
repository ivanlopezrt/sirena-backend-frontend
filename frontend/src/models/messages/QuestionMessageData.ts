import { UUID } from "../shared/UUIDType";


export interface QuestionMessageData{
    messageId:UUID|null;
    question:string;
}