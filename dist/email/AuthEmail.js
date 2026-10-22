"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu Cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask , ya casi esta todo listo, solo debes confirmar tu cuenta </p>
                     <p> Vista el siguiente enlace:</p>
                     <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                     <p>E ingresa el codigo: <b>${user.token}</b></p>
                     <p>Este token expira en 10 minutos </p>                
               `
        });
        console.log('Mensaje enviado', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Restablece tu Password',
            text: 'UpTask - UpTask - Restablece tu Password',
            html: `<p>Hola: ${user.name}, has solicitado restablecer tu password. </p>
                     <p> Vista el siguiente enlace:</p>
                     <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Password</a>
                     <p>E ingresa el codigo: <b>${user.token}</b></p>
                     <p>Este token expira en 10 minutos </p>                
               `
        });
        console.log('Mensaje enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map