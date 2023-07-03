import nodemailer from 'nodemailer'


export const sendRegirsterMail = async (options) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL, //email ID
            pass: process.env.PASSWORD, //Password
        },
    });

    let mailOption = {
        from: process.env.EMAIL,
        to: options.email,
        subject: options.subject,
        html: `${options.message}`,
    };

    await transporter.sendMail(mailOption);
};