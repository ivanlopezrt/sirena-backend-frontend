const feedbackService = require('../services/feedbackService');


exports.createFeedback = async (req, res) => {
    try {
        const {chat_id, message_id} = req.params;
        const {feedback, rating} = req.body;
        const response = await feedbackService.createFeedback(req.user.id, chat_id, message_id, feedback, rating);
        if (response.code === 200) {
            res.status(response.code).json(response.message);
        } else {
            res.status(response.code).json({message: response.message});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};
