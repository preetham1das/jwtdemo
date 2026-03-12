const { verifytoken } = require("./logic");
const students = require("./student");

// middleware to validate JWTs and enforce access control
function authenticate(request, response, next) {
    // first try Authorization header (supports "Bearer <token>" or raw token)
    let token;
    const authHeader = request.headers.authorization || request.headers.Authorization;

    if (authHeader) {
        token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;
        const user_metadata = verifytoken(token);
        if (!user_metadata) {
            return response.status(401).send("Invalid or expired token");
        }
        // make user info available to downstream handlers
        request.user = user_metadata;
    } else {
        // no Authorization header; allow using the verification token as a "key"
        const key = request.body && request.body.key || request.query && request.query.key;
        if (!key) {
            return response.status(401).send("Authorization header is missing");
        }
        // look up student by verification token (the same value sent in the email link)
        const studentEntry = students.find(s => s.token === key && s.access === true);
        if (!studentEntry) {
            return response.status(403).send("Invalid or unverified key");
        }
        // pretend we decoded a JWT so downstream sees familiar fields
        request.user = {
            email: studentEntry.email,
            role: studentEntry.role || 'student',
            access: true
        };
    }

    // route-specific permission checks
    const user_metadata = request.user; // always defined at this point
    if (request.originalUrl === "/admin/dashboard") {
        if (user_metadata.role !== "admin") {
            return response.status(403).send("User with insufficient permission");
        }
    } else {
        // for non-admin routes ensure the student exists and has access granted
        const studentEntry = students.find(
            (stu) => stu.email === user_metadata.email && stu.access === true
        );
        if (!studentEntry) {
            return response.status(403).send("User does not have access");
        }
    }

    next();
}

module.exports = { authenticate }
