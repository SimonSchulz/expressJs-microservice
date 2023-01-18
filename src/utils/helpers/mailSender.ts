import nodemailer from 'nodemailer';

export default async function sendMail(text: string, mail: string) {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
        auth: {
          user: process.env.SENDING_EMAIL_LOGIN,
          pass: process.env.SENDING_EMAIL_PASSWORD
        }
      })
      
    const mailoptions = {
        from: process.env.SENDING_EMAIL_LOGIN,
        to: mail,
        subject: 'Code',
        html: `<h3>Use this code:</h3>
               <h1>${text}</h1>
               </hr>
               <p>Best regards!</P
               <p>NoDaNorm Team</p>
        `,
      }

    await transporter.sendMail(mailoptions);  
}
