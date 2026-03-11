const jwt = require("jsonwebtoken")
const revokeTokens = new Set();

function authenticate(request, response, next) {
const token = request.headers["authorization"]
if (!token) {
    response.status(401).send("Unauthorized: No token provided");
}
 
    try {
        const decoded = jwt.verify(token);
        // request.user = decoded;
        next()
    } catch (error) {
        response.status(401).send("Unauthorized: Failed");
    }
}

module.exports = {authenticate}