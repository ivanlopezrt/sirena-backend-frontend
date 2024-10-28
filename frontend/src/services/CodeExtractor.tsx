/**
 * A utility class for extracting codes from text based on a specific pattern.
 */
export default class CodeExtractor {
    /**
     * Extracts codes from the provided text.
     * 
     * The codes are expected to follow the pattern of an uppercase letter 
     * followed by digits (with optional decimal points) and an optional colon.
     * For example: "A123", "B456.78", "C9:", etc.
     * 
     * @param {string} text - The input text from which to extract codes.
     * @returns {string[]} - An array of extracted codes without colons.
     */
    extract(text: string): string[] {
        const regex = /([A-Z]{1})[0-9\.]{1,6}:?/g; // Regex pattern to match codes
        const codes = text.match(regex); // Match the regex pattern against the text
        return codes ? codes.map(c => c.replace(":", "")) : []; // Return codes without colons
    }
}
