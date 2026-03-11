const express = require("express")
const students = require("./student")
const sendVerificationEmail = require("./mailer")
const { authenticate } = require("./middleware")
const { send } = require("node:process")
const app = express()


app.use(express.json())

app.post('/register', (request, response) => {
    
    const { name, email, password, confirm_password } = request.body || {};

    if (!name || !email || !password || !confirm_password) {
        return response.status(400).json({ error: 'Missing required fields' });
    }

    if (password === confirm_password) {
       
        const token = Math.random().toString(36).substring(2);

        students.push({
            email: email,
            name: name,
            token: token,
            access: false
        });
        sendVerificationEmail(email, token);
        return response.status(200).json({ message: "User registered successfully, please check your email for verification" });
    }

    response.status(400).json({ error: "Passwords do not match" });
});
app.get('/verify', (request, response) => {
    try{
        const  token  = request.query.token;
        console.log(token);
    const user = verifyAccess(token);
    console.log(user);
    if(!user){
        response.send(400).json({ message: "Invalid token" });
    }
    }
    
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
