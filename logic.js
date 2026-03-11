const jwt = require("jsonwebtoken");

const crypto = require("crypto");


const secret = 'preetham-has-a-dog';

function generatetoke(email, password, access) {
    return jwt.sign(
        {
            email: email,
            password: password,
            access: access
        },
        secret,
        {
            algorithm: 'HS256'
        }
    );
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


module.exports = {
    generatetoke,
    verifytoken,
    secret
};


if (require.main === module) {
    const testToken = generatetoke('preetham@gmail.com', 'password', true);
    console.log(testToken);
    console.log(verifytoken(testToken));
}