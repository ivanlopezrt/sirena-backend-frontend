const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

/**
 * Middleware to authenticate JSON Web Tokens (JWT).
 * @function authenticateToken
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void} - Calls next() if authentication is successful, otherwise sends a response with status code 401 or 403.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
