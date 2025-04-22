import { IncomingMessage } from "http";

export default class IncomingMessageParamRetriever{
    message: IncomingMessage;

    constructor(message:IncomingMessage){

        this.message = message;
    }

    retrieve<T>(param:string): T | null {
        const queryString = this.message.url;
        const url = new URL( queryString? queryString: "", "https://localhost");
        return  url.searchParams.get(param) as T;
    }
    
}