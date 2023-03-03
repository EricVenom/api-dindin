const jwt = require('jsonwebtoken');
const jwtPassword = require('../jwtpass');

const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    };

    try {
        const token = authorization.split(' ')[1]
        const validToken = jwt.verify(token, jwtPassword)

        if (validToken) {
            const { id } = validToken;
            req.userId = { id };

            next()
        };

    } catch (error) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }

}

module.exports = verifyToken;