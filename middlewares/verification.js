const db = require('./../helpers/db');
const userQueries = require('./../helpers/queries').user;

module.exports.verification = (req, res, next) => {
    verificarData(req.body).then((data) => {
        if(data){
            next(); 
        }else{
            res.status(401).send({status:401, response: 'Ya el numero esta registrado'}); 
        }
                        
    }).catch((error) => {
        console.log(error)
        res.status(500).send({ response: 'Intentalo de nuevo'})
    })
}

async function verificarData(params) {
    return db.task('verification-number-code', async t => {
        const number = await t.oneOrNone(userQueries.ChequearNumero, [params.number]);
        const code = await t.oneOrNone(userQueries.ChequearCodigo, [params.id_user]);
        if (number) {   
            return false;
        }
        if(code){   
            await t.none(userQueries.BorrarCodigo, [params.id_user]);
        }
        return true
    }).catch((error) => {
        throw error
    });
}