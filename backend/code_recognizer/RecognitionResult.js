/**
 * Class representing the result of a recognition process.
 */
class RecognitionResult{

    /**
     * Creates an instance of RecognitionResult.
     * @param {string} message - The message resulting from the recognition process.
     * @param {boolean} error - Indicates whether there was an error during recognition.
     */
    constructor(message, error){
        this.message = message;
        this.error= error;
    }
}

module.exports = RecognitionResult;
