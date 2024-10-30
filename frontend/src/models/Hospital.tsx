/**
 * Interfaz que representa un hospital en el sistema.
 */
export default interface Hospital {
    /**
     * Identificador único del hospital.
     */
    id: string;

    /**
     * Nombre del hospital.
     */
    name: string;

    /**
     * Código postal donde se encuentra ubicado el hospital.
     */
    postal_code: string;
}
