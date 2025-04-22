import { UUID } from "crypto";

export default interface AuthUser{
    id: UUID;
    email: string;
}