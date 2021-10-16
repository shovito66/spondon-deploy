const nodemailer = require("nodemailer");

const sendEmail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, // Using SMTP For Sending Mail
            // secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            }

            // service: 'gmail',
            // auth: {
            //     user: 'flamingo.devs16@gmail.com',
            //     pass: process.env.GMAIL_PASS
            // }
        });

        // console.log(email)

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            text: text,

            // from: "flamingo.devs16@gmail.com",
            // to: email,
            // subject: subject,
            // text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;