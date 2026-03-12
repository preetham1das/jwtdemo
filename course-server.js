// const express = require("express");
// const students = require("./student");
// const sendVerificationEmail = require("./mailer");
// const { authenticate } = require("./middleware");
// const app = express();

// app.use(express.json());

// app.post('/register', (request, response) => {
//     const { name, email, password, confirm_password } = request.body || {};

//     if (!name || !email || !password || !confirm_password) {
//         return response.status(400).json({ error: 'Missing required fields' });
//     }

//     if (password === confirm_password) {
//         const token = Math.random().toString(36).substring(2);

//         students.push({
//             email,
//             name,
//             password,          // keep plaintext for simplicity (not secure!)
//             token,
//             access: false,
//             role: 'student'
//         });
//         sendVerificationEmail(email, token);
//         return response.status(200).json({ message: "User registered successfully, please check your email for verification" });
//     }

//     response.status(400).json({ error: "Passwords do not match" });
// });

// function verifyAccess(token) {
//     // token is a random string stored on student record during registration
//     return students.find((s) => s.token === token) || null;
// }

// // common logic for both GET and POST verification
// function handleVerification(request, response) {
//     try {
//         const token = request.method === 'GET'
//             ? request.query.token
//             : (request.body && request.body.token);
//         if (!token) {
//             return response.status(400).json({ message: "Token is required" });
//         }

//         const student = verifyAccess(token);
//         if (!student) {
//             return response.status(401).json({ message: "Invalid token" });
//         }

//         student.access = true;
//         student.verified = true;
//         response.send("Email verified successfully, you can now access the courses");
//     } catch (error) {
//         console.log("verification error", error);
//         response.status(500).json({ error: "An error occurred during verification" });
//     }
// }

// app.get('/verify', handleVerification);
// app.post('/verify', handleVerification);

// // login route to issue a JWT after the user has verified their email
// app.post('/login', (request, response) => {
//     const { email, password } = request.body || {};
//     if (!email || !password) {
//         return response.status(400).json({ error: 'Email and password required' });
//     }

//     const student = students.find(s => s.email === email && s.password === password);
//     if (!student) {
//         return response.status(401).json({ error: 'Invalid credentials' });
//     }
//     if (!student.access) {
//         return response.status(403).json({ error: 'Email not verified' });
//     }

//     // generate JWT with access flag and role
//     const token = require('./logic').generatetoke(email, password, student.access, student.role || 'student');
//     response.json({ token });
// });

// app.post('/dashboard', authenticate, (request, response) => {
//     response.json({ students });
// });

// app.post('/admin/dashboard', authenticate, (request, response) => {
//     response.json({ students });
// });

// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

const express=require('express')
const students=require('./student')
const sendVerificationEmail=require("./mailer")
const {authenticate}=require('./middleware')
const { generateToken, verifyAccess} =require('./logic')
const { verify } = require('crypto')
const app=express()
app.use(express.json())
app.post("/register",(req,res)=>{
    const{name,email,password,confirm_password,role}=req.body
    if(password==confirm_password){
        const token=generateToken(email,null,true,role)
        students.push({
            email:email,
            name:name,
            token:token,
            access:false
        })
        sendVerificationEmail(email,token)
        res.status(200).json({message:"Sucessfull"})
    }
})







app.get('/verify',(req,res)=>{
    try{
        const token=req.query.token
        const user=verifyAccess(token)
//         const student=student.where((stu.email==user.email))
        const stu = students.find(s => s.email === user.email)

        if(!stu){
            return res.status(404).json({message:"User not found"})
        }

        stu.access = true
        stu.verified = true

        res.json({message:"success"})
    }
    catch(error){
        res.status(400).json({message:"Invalid token"})
    }
})



app.post('/dashboard',authenticate,(req,res)=>{
    res.json({
        students:students
    })
})
app.post('/admin/dashboard',authenticate,(req,res)=>{
    res.json({
        students:students
    })
})
app.listen(3000,()=>{
    console.log("server is running at port 3000");
})