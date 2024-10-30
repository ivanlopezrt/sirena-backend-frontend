
const RecognitionService = require('../code_recognizer/RecognitionService');
const messageService = require('../services/messageService');

exports.getMessages = async (req, res) => {
    try {
        const {chat_id} = req.params;
        const {page} = req.query
        const messages = await messageService.getMessages(req.user.id, chat_id, page);
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.createMessage = async (req, res) => {
    try {
        const {chat_id} = req.params;
        const {role, text, id} = req.body;
        const response = await messageService.createMessage(req.user.id, chat_id, id, role, text);
        if (response.code === 200) {
            const messages = (await messageService.getMessages(req.user.id,chat_id));
            const recognizer = new RecognitionService(req.user.id, chat_id);
            res.status(response.code).json(await recognizer.recognize(messages));
            
        } else {
            res.status(response.code).json({message: response.message});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

