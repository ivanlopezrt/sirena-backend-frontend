const {Role, User} = require('../models');

/**
 * Middleware to ensure that the user has admin privileges.
 * @function adminMiddleware
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Calls next() if the user is an admin, otherwise responds with an error.
 */
const adminMiddleware = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({message: 'Usuario no autenticado'});
    }

    const findUser = await User.findOne({where: {id: user.id}});

    if (!findUser) {
        return res.status(400).json({message: 'Usuario no valido'});
    }

    const role = await Role.findOne({where: {id: findUser.dataValues.role_id}})
    if (role.dataValues.name !== "Admin") {
        return res.status(403).json({message: 'Acceso denegado'});
    }
    next();
};

module.exports = adminMiddleware;
