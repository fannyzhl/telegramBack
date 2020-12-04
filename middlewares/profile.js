const db = require('./../helpers/db');
const profileQueries = require('./../helpers/queries').profile;

module.exports.profile = (req, res, next) => {
    verificarData(req.body).then((data) => {
        if(data){
            next(); 
        }else{
            res.status(401).send({response: 'Ya existe el nombre de usuario'}); 
        }
                        
    }).catch((error) => {
        console.log(error)
        res.status(500).send({ response: 'Intentalo de nuevo'})
    })
}

async function verificarData(params) {
    return db.task('verification-username', async t => {
        const data = await t.oneOrNone(profileQueries.BuscarUsuario, [params.username, params.id_user]);
        if (data) {   
            return false;
        }
        return true
    }).catch((error) => {
        throw error
    });
}