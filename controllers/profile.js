const express = require('express');
const db = require('./../helpers/db');
const profileQueries = require('./../helpers/queries').profile;
const profile = require('./../middlewares/profile').profile;

let router = express.Router();

router.post('/actualizarPerfil', profile, (req, res) => {
    db.any(profileQueries.ActualizarPerfil, [req.body.name, req.body.last_name, req.body.username, req.body.id_user])
    .then(async(data) => {
        res.status(200).send({
            status: 200,
            response: 'Se pudo actualizar el perfil',
        });
    }).catch((error) => {
        res.status(500).send({
            status: 500,
            response: 'Intentalo de nuevo'
        });
    })
});

router.get('/leerPerfil/:id', (req, res) => {
    const id = req.params.id;
    db.any(profileQueries.LeerUsuario, [id])
    .then(async(data) => {
        res.status(200).send({
            status: 200,
            data:data,
        });
    }).catch((error) => {
        res.status(500).send({
            status: 500,
            response: 'Intentalo de nuevo'
        });
    })
});

router.post('/borrarUsuario', profile, (req, res) => {
    db.any(profileQueries.BorrarUsuario, [req.body.id_user])
    .then(async(data) => {
        res.status(200).send({
            status: 200,
            response: 'Se pudo borrar el usuario',
        });
    }).catch((error) => {
        res.status(500).send({
            status: 500,
            response: 'Intentalo de nuevo'
        });
    })
});

module.exports = router;