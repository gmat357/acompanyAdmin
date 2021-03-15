var express = require('express');
var router = express.Router();
var db = require('../mysql/index').mysql();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var date = require('../function/date').date();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


router.get('/join',(req,res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/login";
            </script>
        `)
        return;
    }
    res.render('join');
});

router.post('/joinAction',(req,res)=>{
    var body = req.body;
    var id = body.id;
    var psw = body.psw;
    bcrypt.hash(psw ,null,null,(err,hash)=>{
        if(err) throw err;
        var sql = {
            id:id,
            psw:hash,
            insert_date:date,
        };
        db.query('alter table admin_user auto_increment = 1');
        db.query('insert into admin_user set ?',sql,(err,rows)=>{
            if(err) throw err;
            res.redirect('/login');
        });
    });
});

module.exports = router;