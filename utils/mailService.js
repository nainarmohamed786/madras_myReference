import nodemailer from 'nodemailer';

const sendMail=async(options)=>{
    if(!process.env.SMTP_HOST ||
        !process.env.SMTP_PORT ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASSWORD
    ){
        throw new Error("Missing SMTP enviroment variables");
    }

    const transporter=nodemailer.createTransport({
        service:"gmail",
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        },
    });

    const message={
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        html:options.message
    };

    await transporter.sendMail(message);
};

export default sendMail;