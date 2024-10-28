import { Role } from "./Role";

/**
 * Interfaz que representa a un usuario en el sistema.
 */
export default interface User {
    /**
     * Nombre del usuario.
     */
    name: string;

    /**
     * Correo electrónico del usuario.
     */
    email: string;

    /**
     * Número colegiado del usuario.
     */
    collegiate_number: number;

    /**
     * Rol del usuario en el sistema.
     */
    role_name: Role;

    /**
     * Nombre del hospital al que pertenece el usuario.
     */
    hospital_name: string;

    /**
     * Nombre de la especialidad del usuario.
     */
    specialty_name: string;
}
