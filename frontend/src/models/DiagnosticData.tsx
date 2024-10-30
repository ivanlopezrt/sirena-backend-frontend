import { Gender } from "./Gender";

/**
 * Interfaz que representa los datos diagnósticos de un paciente.
 */
export default interface DiagnosticData {
    /**
     * Número de documento de identidad del paciente.
     */
    dni: string;

    /**
     * Género del paciente, representado por un objeto Gender.
     */
    gender: Gender;

    /**
     * Diagnóstico del paciente, que puede ser una cadena de texto o un arreglo de cadenas.
     */
    diagnosis: string | string[];

    /**
     * Identificador único del mensaje relacionado con los datos diagnósticos (opcional).
     */
    message_id?: string;
}
