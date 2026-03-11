const express = require('express');
const { generatetoke, verifytoken } = require('./logic');

const app = express();
app.use(express.json());


const users = {
    pratham: "abc123",
    rahul: "rahul123",
    ankit: "ankit123",
    preetham: "preetham123"
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        const token = generatetoke(username, password, true);
        res.json({ message: "token generated", token });
    } else {
        res.status(401).json({ message: "token is not generated", valid: "Invalid credentials" });
    }
});

app.get('/check', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(402).json({ message: "Token is required" });
    }
    try {
        const decoded = verifytoken(token);
        if (!decoded) throw new Error();
        res.json({ message: "Token is valid", user: decoded });
    } catch {
        res.status(403).json({ message: "Token is Invalid" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
