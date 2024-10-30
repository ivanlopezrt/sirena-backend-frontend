const messageService = require("../../services/messageService");
const   RecognitionResult = require("../RecognitionResult");

/**
 * Class representing a recognizer that interacts with the Ribera API.
 */
class RiberaCodeRecognizer {

    _HOST = process.env.RIBERA_HOST;

    /**
     * Creates an instance of RiberaCodeRecognizer.
     */
    constructor() {
        process.env.EMAIL_USER
    }


    /**
     * Sends the latest message and the message history to the Ribera API.
     *
     * @param {Array} messages - An array of message objects, where each object contains role and text.
     * @returns {Promise<RecognitionResult>} The result of the recognition process.
     */
    async ask(messages) {

        const [last_message,...rest] = messages

        const new_message = {role:last_message.role, content:last_message.text}

        const history = rest.map(m=>{  return {role: m.role, content: m.text} })

        const body = { history: history, new_message: new_message }

        return await this._request(body);

    }


    /**
     * Sends a request to the Ribera API with the provided body.
     *
     * @param {Object} body - The request body containing message history and the new message.
     * @returns {Promise<RecognitionResult>} The result of the API request.
     * @private
     */
    async _request(body) {

        try{
            const response =  await fetch(this._HOST + "/generate",{
                method: 'POST',
                headers: {},
                body: JSON.stringify(body),
            });

            if(response.ok){
                const data = await response.json();

                if(data && data.length){
                    return new RecognitionResult(data[0].generated_text, false);
                }

            }

            return new RecognitionResult("Lo siento. Algo ha fallado", true);
        }
        catch{
            return new RecognitionResult("Lo siento. Algo ha fallado", true);
        }

    }

}

module.exports = RiberaCodeRecognizer;
