import AuthUser from "../AuthUser";
import TokenValidatorInterface from "./TokenValidatorInterface";
import jwt, { Secret } from 'jsonwebtoken';

export default class JWTTokenValidator implements TokenValidatorInterface {
    
    async validate(token?: string): Promise<AuthUser | null> {
        if (!token) {
            return null;
        }

        const secretKey = "6e2d3f3e4b3a2d1c4f5e6d7b8c9e0a1f2b3d4e5f6a7b8c9d0e1f2g3h4i5j6k7";

        try {
            const decoded = jwt.verify(token, secretKey) as AuthUser;
            console.log("decoded",decoded);
            return decoded;
        } catch (err) {
            console.error("Error al verificar token:", err);
            return null;
        }
    }
}
