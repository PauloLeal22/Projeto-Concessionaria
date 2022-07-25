import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import jwtSecret from '../middlewares/authConfig.json' assert { type: 'json' };

import { Usuario } from '../models/Usuario.js';
const usuarioModel = new Usuario;

class LoginController {
    async index(req, res) {
        let error = req.flash('erroLogin');

        return res.render('login/login.ejs', {error: error ? error : ''});
    }

    async auth(req, res) {
        const { login, senha } = req.body;

        const usuario = await usuarioModel.getUsuario('login', login);

        if(usuario.length == 0){
            req.flash('erroLogin', 'Usuário não cadastrado!');
            res.status(404);
            res.redirect('/login');
        }else{
            if(!bcrypt.compareSync(senha, usuario[0].senha)){
                req.flash('erroLogin', 'Login ou senha incorretos!')
                res.status(401);
                res.redirect('/login');
            }else{
                jwt.sign({idUsuario: usuario[0].id_usuario}, jwtSecret.secret, {expiresIn: '3h'}, (err, token) => {
                    if(err){
                        req.flash('erroLogin', 'Houve um erro ao validar o usuário!');
                        res.status(400);
                        res.redirect('/login');
                    }else{
                        req.session.token = `Bearer ${token}`;
                        res.redirect('/home');
                    }
                });
            }
        }
    }

    async home(req, res) {
        res.render('dashboard/dashboard.ejs');
    }
}

export { LoginController };