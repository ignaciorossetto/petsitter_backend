import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
import config from './config.js';


export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth:{
                user: config.mailUser,
                pass: config.mailPassword
            }
        })
    }

   

    send = async(user,subject, html) => {
        console.log('config: ', config)
        response = await new Promise((res,rej)=> {
            this.transport.sendMail({
                from: `PetSitterFinder <${config.mailUser}>`,
                to: user.email,
                subject: subject,
                html
            }, (err, info) => {
                if (err) {
                    console.log('err nodemailer:', err)
                    rej(err)
                } else {
                    res(info)
                }
            })
        })
        console.log('response: ', response)
        return response
    }

}


export const confirmUserByMail = async(user, type) => {
    const token = jwt.sign({ user }, config.jwtSecret + user.password, {
        expiresIn: "15m",
      });
      const link = `${config.feUrl}/sign-up/confirmation?token=${token}&email=${user.email}&type=${type}`;
      const Mailer = new Mail();
      const html = ` 
      <h1>Hola ${user.username}</h1>
      <p>Para confirmar tu cuenta, ingresa al siguiente <a href=${link}><strong>Link</strong></a></p>
      <br>
      <p>Recuerda que el link expira en 15 minutos.</p>
      `;
      try {
        await Mailer.send(user, "Confirma tu cuenta en PetSitterFinder", html);
        return true
      } catch (error) {
        return error
      }
}

export const checkMailConfirmation = (token, user) => {
      const userAuth = jwt.verify(token, config.jwtSecret + user.password);
      if (!userAuth) {
        return false
      }
      return true
  };

