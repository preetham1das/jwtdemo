const nodemailer = require('nodemailer')
const transporter   = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user:"daspreetham60@gmail.com",
        pass:process.env.password
    }
    
})
function sendVerificationEmail(email, token) {
    const link = `http://localhost:3000/verify?token=${token}`;
    const options = {
        from: "daspreetham60@gmail.com",
        to: email,
        subject: 'Verify your email',
        html:`<h1>Verify your account </h1>
        <a href="${link}">
        Verify Email
        </a>
        `
    }
    transporter.sendMail(options, (err, info) => {
        if(err)
            console.log(err)
        console.log(`email sent Info:${info}`)
})
}
module.exports=sendVerificationEmail

