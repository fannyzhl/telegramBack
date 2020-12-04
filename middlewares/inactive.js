const db = require('../helpers/db');
const userQueries = require('../helpers/queries').user;

module.exports.inactive = (req, res, next) => {
    return db.task('verification-inactive', async t => {
        const inactive = await t.oneOrNone(userQueries.VerificarActivo, [req.body.id_user])
        if (!inactive) {   
            res.status(401).send({
                status: 401,
                response: 'El usuario ya esta activo'
            });
        }else{   
            next();
        }
 
    }).catch((error) => {
        res.status(500).send({
            status: 500,
            response: 'Intentalo de nuevo'
        });
    });
}
