module.exports.desconectado = (req, res, next) => {
    if (!req.isAuthenticated())
        next();
    else 
         res.status(304).send({response: 'Ya hay una sesión activa'});        
}

module.exports.conectado = (req, res, next) => {
    if (req.isAuthenticated())
        next();
    else
        res.status(304).send({response: 'Debes iniciar sesion primero'});  
}