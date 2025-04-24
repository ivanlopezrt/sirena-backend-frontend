import AuthUser from "../AuthUser";

export default interface TokenValidatorInterface{
    
    validate(token:string): Promise<AuthUser | null>;
}