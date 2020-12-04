const db = require('./../helpers/db');
const userQueries = require('./../helpers/queries').user;

module.exports.number = (req, res, next) => {
    verificarData(req.body).then((data) => {
        if(data){
            res.status(401).send({status:401, response: 'El numero no esta registrado'}); 
        }else{
            next();
        }
                        
    }).catch((error) => {
        console.log(error)
        res.status(500).send({ status:500, response: 'Intentalo de nuevo'})
    })
}

async function verificarData(params) {
    return db.task('verification-number', async t => {
        const number = await t.oneOrNone(userQueries.ChequearNumero, [params.number]);
        if (number) {   
            const code = await t.oneOrNone(userQueries.ChequearCodigo, [number.id_user]);
            if(code){   
                await t.none(userQueries.BorrarCodigo, [number.id_user]);
            }
            return false;
        }
        return true
    }).catch((error) => {
        throw error
    });
}