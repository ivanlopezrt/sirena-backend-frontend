/**
 * Interfaz que representa un código de diagnóstico en el sistema.
 */
export default interface DiagnosisCode {
    /**
     * Identificador único del código de diagnóstico, que puede ser de cualquier tipo.
     */
    id: any;

    /**
     * Código que representa el diagnóstico.
     */
    code: string;

    /**
     * Descripción del diagnóstico asociado al código.
     */
    description: string;
}
