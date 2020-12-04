const db = require('./../helpers/db');
const userQueries = require('./../helpers/queries').user;

module.exports.isNew = (req, res, next) => {
    verificarData(req.body).then((data) => {
        if(data){
            next(); 
        }else{
            res.status(401).send({status:401, response: 'Ya existe el nombre de usuario'}); 
        }
                        
    }).catch((error) => {
        console.log(error)
        res.status(500).send({status:500, response: 'Intentalo de nuevo'})
    })
}

async function verificarData(params) {
    return db.task('verification-username', async t => {
        const data = await t.oneOrNone(userQueries.Buscar, [params.username]);
        if (data) {   
            return false;
        }
        return true
    }).catch((error) => {
        throw error
    });
}

