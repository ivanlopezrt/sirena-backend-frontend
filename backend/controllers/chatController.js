const chatService = require('../services/chatService');

exports.getChats = async (req, res) => {
    try {
        const chats = await chatService.getChats(req.user.id)
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.getChat = async (req, res) => {
    try {
        const {chat_id} = req.params
        const chat = await chatService.getChat(req.user.id, chat_id)
        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.deleteChat = async (req, res) => {
    try {
        const {chat_id} = req.params
        const response = await chatService.deleteChat(req.user.id, chat_id)
        res.status(response.code).json({message: response.message});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};
