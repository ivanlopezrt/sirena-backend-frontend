/**
 * Interfaz para la respuesta de un solicitante genérico.
 * @template T - Tipo de datos que se incluirán en la respuesta.
 */
export default interface IRequesterResponse<T> {
    /**
     * Código de estado de la respuesta.
     */
    code: number;

    /**
     * Datos devueltos por la solicitud.
     */
    data: T;

    /**
     * Indica si la solicitud fue exitosa.
     */
    success: boolean;
}
