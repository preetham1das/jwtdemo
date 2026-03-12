const jwt = require("jsonwebtoken");

const crypto = require("crypto");


const secret = 'preetham-has-a-dog';

function generateToken(email, password, access, role) {
    return jwt.sign(
        {
            email: email,
            password: password,
            role: role,
            access: access,
        },
        secret,
        {
            algorithm: 'HS256'
        }
    );
}

// keep the original name for backwards compatibility
function generatetoke(email, password, access, role) {
    return generateToken(email, password, access, role);
}

function verifytoken(token) {
    try {
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256']
        });
        return decoded;
    } catch (e) {
        return null;
    }
}

// helper for verifying the short-lived email token stored on student records
const students = require("./student");
function verifyAccess(token) {
    return students.find((s) => s.token === token) || null;
}


module.exports = {
    generateToken,
    generatetoke,
    verifytoken,
    verifyAccess,
    secret
};


if (require.main === module) {
    const testToken = generatetoke('preetham@gmail.com', 'password', true);
    console.log(testToken);
    console.log(verifytoken(testToken));
}