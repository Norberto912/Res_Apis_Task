"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../email/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            //prevenir duplicados
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                const error = new Error("El Usuario ya esta registrado");
                return res.status(409).json({ error: error.message });
            }
            //crea un usuario
            const user = new User_1.default(req.body);
            // hash Password
            user.password = await (0, auth_1.hashPassword)(password);
            //Generar Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user._id;
            //enviar el email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send("Cuenta creada, revisa tu email para confirmarla");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            console.log(req.body);
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExists.user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send("Cuenta confirmada correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("Usuario no encontrado");
                return res.status(404).json({ error: error.message });
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user._id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                //enviar el email
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });
                const error = new Error("La cuenta no ha sido confirmada, hemos enviado un e-mail de comnfirmacion");
                return res.status(401).json({ error: error.message });
            }
            //revisar password
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            console.log(isPasswordCorrect);
            if (!isPasswordCorrect) {
                const error = new Error("Password Incorecto");
                return res.status(401).json({ error: error.message });
            }
            // const token = generateJWT({id: user.id} );
            const token = (0, jwt_1.generateJWT)({ id: user._id.toString() });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            //Usuario existe
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El Usuario no esta registrado");
                return res.status(404).json({ error: error.message });
            }
            if (user.confirmed) {
                const error = new Error("El Usuario ya esta confirmado");
                return res.status(403).json({ error: error.message });
            }
            //Generar Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user._id;
            //enviar el email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send("Se envio un nuevo token a tu e-mail");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            //Usuario existe
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El Usuario no esta registrado");
                return res.status(404).json({ error: error.message });
            }
            //Generar Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user._id;
            await token.save();
            //enviar el email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            res.send("Revisa tu email para instrucciones");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            res.send("Token valido, Define tu nuevo password");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error("Token no valido");
                return res.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExists.user);
            user.password = await (0, auth_1.hashPassword)(password);
            // await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            await user.save();
            await tokenExists.deleteOne();
            res.send("El password se modifico correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static user = async (req, res) => {
        return res.json(req.user);
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user._id.toString()) {
            const error = new Error('Este Email ya esta registrador');
            return res.status(409).json({ error: error.message });
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send('Perfil actualizado correctamente');
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user._id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El Password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('El passsword se modifico correctamente');
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user._id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El Password  es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        res.send('Password Correcto');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map