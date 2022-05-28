const nodemailer = require('nodemailer');

// setup email sender tutorial: https://youtu.be/Ery7riVPUEA

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "youremail@gmail.com", // generated ethereal user
        pass: "abdcedfxyz"  // generated ethereal password
    }
});

let sendEmail = (emailTemplate) => {
    transporter.sendMail(emailTemplate, (err, info) => {
        if(err) {
            console.log(err)
        }else{
            console.log('Email sent: ', info.response)
        }
    })
}

module.exports = {sendEmail};