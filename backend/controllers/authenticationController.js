const authService = require('../services/authService');

exports.authenticateUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const authCode = await authService.authenticateUser(email, password);
        res.status(authCode.code).json({message: authCode.message});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.verifyCode = async (req, res) => {
    const {email, code} = req.body;

    try {
        const verifyLogin = await authService.verifyCode(email, code);
        if (verifyLogin.code === 200) {
            res.status(verifyLogin.code).json({token: verifyLogin.token, user: verifyLogin.user});
        } else {
            res.status(verifyLogin.code).json({message: verifyLogin.message});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};
