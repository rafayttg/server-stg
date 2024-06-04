const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) {
        return res.status(401).send("unauthorized"); // If no token, unauthorized
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If token is not valid, forbidden
        }
        req.user = user; // Attach user to request
        next(); // Pass the execution off to whatever request the client intended
    });
};

module.exports = authenticateToken;