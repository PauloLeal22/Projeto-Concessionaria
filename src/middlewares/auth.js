import jwt from 'jsonwebtoken';
import jwtSecret from './authConfig.json' assert { type: 'json' };

function auth (req, res, next) {
    const authToken = req.session.token;

    if(authToken != undefined) {
        const bearer = authToken.split(' ');
        const token = bearer[1];

        jwt.verify(token, jwtSecret.secret, (err, data) => {
            if(err){
                res.status(401);
                res.json({err: "Token inválido!"});
            }else{
                req.idUsuario = data.idUsuario;
                next();
            }
        });
    } else {
        res.status(401);
        res.json({err: "Token inválido!"});
    }
}

export { auth };