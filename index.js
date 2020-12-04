const express = require('express');
const config = require('./helpers/config');
const jwt = require('express-jwt');
let passport = require('passport');

var app = express();
var server = require('http').Server(app);

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(jwt({
  secret: config.secret
}).unless({
    path: ['/user/registrar', '/user/verificarNumero', '/user/guardarNumero', '/user/iniciar', '/user/enviarCodigo', '/']
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
  
app.get('/', function (req, res) {
    res.redirect('views/index.html');
}); 

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http:192.168.250.6:"+ config.clientPort);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use('/', require('./controllers'))

server.listen(config.serverPort, function(){
    console.log('listening on **:'+config.serverPort);
});

//app.use('/views', express.static(__dirname + '/public'));
// app.use(express.json());
// app.use(express.urlencoded({
//   extended: false
// }))
// app.use(jwt({
//   secret: config.secret
// }).unless({
//     path: ['/user/registrar', '/user/verificarNumero', '/user/guardarNumero', '/user/iniciar', '/user/enviarCodigo', '/']
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

// app.get('/', function (req, res) {
//   res.redirect('views/index.html');
// }); 

// app.use(function (err, req, res, next) {
//   console.log("aaahvghva");
//   res.header("Access-Control-Allow-Origin", "192.168.250.6:"+ config.clientPort);
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send({
//       message: 'invalid token...',
//       status:401
//     });
//   }
// });
// app.use('/', require('./controllers'));

// app.listen(config.serverPort, function () {
//   console.log('Example app listening on port 3000!');
// });



