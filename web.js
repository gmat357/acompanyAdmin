var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');


var indexRouter = require('./routers/index');
var loginRouter = require('./routers/login');
var authRouter = require('./auth/index');
var linkRouter = require('./routers/link');
var slideRouter = require('./routers/slide');
var priceRouter = require('./routers/price');
var joinRouter = require('./routers/join');

app.use('/public',express.static(path.join(__dirname,"public")));
app.use('/upload/img',express.static(path.join(__dirname,"public/upload/img")));

app.set('views',path.join(__dirname,"/views"));
app.set("view engine",'ejs');

app.use(flash());
app.use(session({secret:'keyboard cat', resave:true, saveUninitialized:false}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',indexRouter);
app.post('/consulting/getList',indexRouter);
app.post('/consulting/:page',indexRouter);
app.post('/consultingUpdate/:page',indexRouter);
app.post('/consulting_delete_List',indexRouter);
app.get('/login', loginRouter);
app.post('/loginAction', authRouter);

app.get('/link',linkRouter);
app.post('/link/:page',linkRouter);

app.get('/slide',slideRouter);
app.post('/slide/:page',slideRouter);

app.get('/price',priceRouter);
app.post('/price/:page',priceRouter);

app.get('/join',joinRouter);
app.post('/joinAction',joinRouter);
app.listen(port,()=>{console.log(`${port} 서버 오픈`)});

// process.on('uncaughtException', function (err) {
//     console.log('Caught exception: ' + err);
//   });
  
//   setTimeout(function () {
//     console.log('This will still run.');
//   }, 500);
//   console.log('This will not run.');
