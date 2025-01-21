import nodemailer from "nodemailer"

export const sendEmail = async (to:string, subject: string, text: string) => {
   try {
    const transport = nodemailer.createTransport({  // creating my transport
        service: "gmail",  //listing the specific email service
        auth: {
           user: process.env.EMAIL,  //email addres type shi
           pass: process.env.EMAIL_APP_PASSWORD  //password type shi
        }
   })
    
   //defining the email options
   const options = {
       from: process.env.EMAIL,
       to,
       subject,
       text
   }

   //send the mail type shiiiii
   const info = await transport.sendMail(options);

   console.log(`Email sent: ${info.response}`)
   } catch (error) {
        console.error(`Error sending email ${error}`)
   }
}