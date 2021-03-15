var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');
var db = require('../mysql/index').mysql();

var bcrypt = require('bcrypt-nodejs');
 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(cookieParser('keyboard cat'));

router.use(session({secret:'keyboard cat', resave:true, saveUninitialized:false}));

router.use(flash());

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    var userInfo;
    db.query('select * from `admin_user` where id = ?',id,(err,rows)=>{
        if(err) throw err;
        var json = JSON.stringify(rows[0]);
        userInfo = JSON.parse(json);
        done(null, userInfo);
    });
});

passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField:'psw'

},
(username,password,done)=>{  
    var login_result = "실패";
    var day = require('../function/date');
    db.query('select * from admin_user where id = ?', username,(err, rows)=>{
        if(rows.length == 0){
            console.log(username+"으로 로그인을 시도하였습니다. " + "DATE : " + day.date() + " 처리결과 : " + login_result  + "원인 : 등록된 계정없음");
            return done(null, false, {message:'등록된 계정이 없습니다.'});
        }
        if(err) throw err;

        if(bcrypt.compareSync(password, rows[0].psw)){
            login_result = "성공";
            console.log(username+"으로 로그인을 시도하였습니다. " + "DATE : " + day.date() + " 처리결과 : " + login_result);
            return done(null, rows[0]);
        }else{
            console.log(username+"으로 로그인을 시도하였습니다. " + "DATE : " + day.date() + " 처리결과 : " + login_result + "원인 : 비밀번호 불일치");
            return done(null,false,{message:"비밀번호가 일치하지 않습니다."});

        }
    });
}));

router.post('/loginAction',passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),(req,res)=>{
    res.redirect('/');
});

router.get('/logout', (req, res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/admin/login"
            </script>
        `)
        return;
    }
    var user = req.user.name;
    var id = req.user.id;
    var day = require('../function/date');
    console.log(`${id}(${req.user.user_kinds} ${user}) 님이 로그아웃 하셨습니다. DATE : ${day.date()} 처리결과 : 성공`);
    req.logout();
    res.send(`
        <script>
            alert("로그아웃 되었습니다.");
            location.href="/login";
        </script>
    `);
    return;
})

module.exports = router;