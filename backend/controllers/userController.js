const userService = require("../services/userService");

exports.getUsers = async (req, res) => {
    try {
        const {page} = req.query
        const users = await userService.getUsers(page);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};