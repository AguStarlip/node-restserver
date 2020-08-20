const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUC_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

// Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    // Verifica si el token de google es valido, si es asi almacena token
    let googleUser = await verify(token)
        .catch((e) => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Buscar en base de datos si existe un usuario con ese mail
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            // Si usuario existe
            if (usuarioDB.google === false) {
                // No se autentico por google
                // Usuario se autentico de forma normal, no permitido autenticacion por google
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Ya se ha autenticado'
                    }
                });
            } else {
                // Si el usuario se autentico por google
                // Renueva token y lo devuelve
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUC_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe en base de datos
            // Crea usuario y guarda en base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUC_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }

    });
});

module.exports = app;