import LocalStorager from "./impl/LocalStorager";
import IStorager from "./IStorager";

/**
 * Factoria para crear instancias de IStorager.
 */
export default class StoragerFactory {
    /**
     * Crea y devuelve una instancia por defecto de IStorager utilizando LocalStorager.
     * @returns Una instancia de IStorager.
     */
    static defaultStorager(): IStorager {
        return new LocalStorager();
    }
}
