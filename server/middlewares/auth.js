const jwt = require('jsonwebtoken');

//================
// Verificar Token
//================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });



};

//================
// Verificar AdminRole
//================

let verificaAdmin_Role = (req, res, next) => {

    let usuario_role = req.usuario.role;

    if (usuario_role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    } else {
        next();
    }

}

//================
// Verificar Token Imagen
//================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}