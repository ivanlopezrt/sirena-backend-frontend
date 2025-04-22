import { randomUUID } from "crypto";
import AuthUser from "../AuthUser";
import TokenValidatorInterface from "./TokenValidatorInterface";

export default class BypassTokenValidator implements TokenValidatorInterface{
    
    async validate(token:string): Promise<AuthUser | null>{
       return {id:randomUUID(),email:"useremail@meytel.net"};
    }

}