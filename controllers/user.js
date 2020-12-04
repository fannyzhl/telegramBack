const express = require('express');
const db = require('./../helpers/db');
const userQueries = require('./../helpers/queries').user;
const isNew = require('./../middlewares/isNew').isNew;
const verification = require('./../middlewares/verification').verification;
const number = require('./../middlewares/number').number;
const inactive = require('./../middlewares/inactive').inactive;
const isLogged = require('./../middlewares/isLogged');
var accountSid = 'AC8ba4be92d2b57da61fdf333773e18ed2';
var authToken = 'ea372221497262062e717b8b9e9280b1'
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
const jwt = require('jsonwebtoken');
const config = require('../helpers/config');

let router = express.Router();
//registrar los datos del usuario antes de la verificacion del numero
router.post('/registrar', isLogged.desconectado, isNew, (req, res) => {
    db.one(userQueries.AgregarUsuario, [req.body.name, req.body.last_name, req.body.username])
    .then(async(data) => {
        res.status(200).send({
            status: 200,
            response: 'Exito',
            user: data.id_user
        });
    }).catch((error) => {
        res.status(500).send({
            status: 500,
            response: 'Intentalo de nuevo'
        });
    })
});

router.post('/guardarNumero', verification, (req, res) => {
    let code=null;
    db.task('save-number', async task => {
        let {id_user,number} = await req.body;
        let query = await task.none(userQueries.GuardarNumero, [number, id_user])
        code = await Math.floor(Math.random()* (9999 - 1000))+1000 ;
        await task.none(userQueries.GuardarCodigo, [code, id_user])
        client.messages.create({
            body: 'El codigo de verificacion es: '+code,
            to: number,  // Número al que se enviará el SMS
            from: '+12565968740' // Número comprado de Twilio.com
        })
        .then((message) => console.log(message.sid))
        .catch((error) => {
            console.log(error);
            res.status(500).send({ response: 'No se pudo enviar el codigo' })
        })
    })
    .then((data) => {
        res.status(200).send({status:200, response:'Se envio el codigo', data:code});
    }).catch((error) => {
        console.log(error);
        res.status(500).send({status:500,  response: 'No se pudo guardar el numero' })
    })
});

router.post('/verificarNumero', inactive, isLogged.desconectado, (req, res) => {
    let jsonWebToken;
    db.task('verification-number', async task => {
        let {id_user,code} = await req.body;
        let data = await task.oneOrNone(userQueries.VerificarCodigo, [id_user, code])
        if (data) {   
            jsonWebToken = await jwt.sign(data, config.secret);
            await task.any(userQueries.VerificarNumero, [id_user])
        }else{   
            res.status(401).send({status:401, response: 'El codigo no coincide' })
        }
    })
    .then((data) => { 
        res.status(200).send({
            status: 200,
            response: 'Se verifico el numero!',
            token: jsonWebToken
        }) 
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ status:500, response: 'No se pudo verificar el numero' })
    })
});

router.post('/iniciar', (req, res) => {
    let jsonWebToken;
    db.task('login', async task => {
        let {id_user,code} = await req.body;
        let data = await task.oneOrNone(userQueries.VerificarCodigo, [id_user, code])
        if (data) {   
            jsonWebToken = await jwt.sign(data, config.secret);
        }else{   
            res.status(401).send({ response: 'El codigo no coincide' })
        }
    })
    .then((data) => { 
        res.status(200).send({
            status: 200,
            response: 'Inicio de sesion',
            token: jsonWebToken
        }) 
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ response: 'No se pudo iniciar sesion' })
    })
});

router.post('/enviarCodigo', number, isLogged.desconectado, (req, res) => {
    let id=null;
    db.task('send-code', async task => {
        let {number} = await req.body;
        id = await db.oneOrNone(userQueries.ChequearNumero, [number]);
        let code = await Math.floor(Math.random()* (9999 - 1000))+1000 ;
        await task.none(userQueries.GuardarCodigo, [code, id.id_user])
        client.messages.create({
            body: 'El codigo de verificacion es: '+code,
            to: number,  // Número al que se enviará el SMS
            from: '+12565968740' // Número comprado de Twilio.com
        })
        .then((message) => console.log(message.sid))
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status:500, response: 'No se pudo enviar el codigo' })
        })
    })
    .then((data) => {
        res.status(200).send({status:200, response:'Se envio el codigo', user:id.id_user});
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ status:500, response: 'No se pudo guardar el numero' })
    })
});

module.exports = router;