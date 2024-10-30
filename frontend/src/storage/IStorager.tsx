/**
 * Interface representing a storage mechanism.
 */
export default interface IStorager {
    /**
     * Stores a value associated with a key.
     *
     * @param {string} key - The key to associate with the value.
     * @param {unknown} value - The value to store. Can be of any type.
     * @returns {Promise<void>} - A promise that resolves when the value is stored.
     */
    set(key: string, value: unknown): Promise<void>;

    /**
     * Retrieves a value associated with a key.
     *
     * @param {string} key - The key for which to retrieve the value.
     * @returns {Promise<T | null>} - A promise that resolves to the value associated with the key, or null if not found.
     */
    get<T>(key: string): Promise<T | null>;

    /**
     * Removes a value associated with a key.
     *
     * @param {string} key - The key of the value to remove.
     * @returns {Promise<void>} - A promise that resolves when the value is removed.
     */
    remove(key: string): Promise<void>;
}
