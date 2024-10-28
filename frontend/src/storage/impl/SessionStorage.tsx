import IStorager from "../IStorager";

/**
 * Class for managing data in session storage.
 */
export default class SessionStorage implements IStorager {
    /**
     * Stores a value in session storage associated with a key.
     *
     * @param {string} key - The key to associate with the value.
     * @param {unknown} value - The value to store. Can be of any type.
     * @returns {Promise<void>} - A promise that resolves when the value is stored.
     */
    async set(key: string, value: unknown): Promise<void> {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Retrieves a value from session storage associated with a key.
     *
     * @param {string} key - The key for which to retrieve the value.
     * @returns {Promise<T | null>} - A promise that resolves to the value associated with the key, or null if not found.
     */
    async get<T>(key: string): Promise<T | null> {
        const value = window.sessionStorage.getItem(key);
        if (value) {
            return JSON.parse(value) as unknown as T;
        }

        return null;
    }

    /**
     * Removes a value from session storage associated with a key.
     *
     * @param {string} key - The key of the value to remove.
     * @returns {Promise<void>} - A promise that resolves when the value is removed.
     */
    async remove(key: string): Promise<void> {
        window.sessionStorage.removeItem(key);
    }
}
