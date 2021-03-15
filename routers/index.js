var express = require('express');
var router = express.Router();
var db = require('../mysql/index').mysql();
var bodyParser = require('body-parser');

var header = require('../layout/header');
var nav = require('../layout/nav');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


router.get('/',(req,res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/login";
            </script>
        `)
        return;
    }
    var render = {
        header:header.header(),
        nav:nav.nav(),
    }
    res.render('index',render);
});

router.post('/consulting/getList',(req,res)=>{
    db.query('select * from consulting order by no desc',(err,rows)=>{
        if(err) throw err;
        res.json(rows);
    });
});

router.post('/consulting/:page',(req,res)=>{
    var page = req.params.page;
    db.query('select * from consulting where No = ?',page,(err,rows)=>{
        if(err) throw err;
        res.json(rows);
    });
});

router.post('/consultingUpdate/:page',(req,res)=>{
    var page = req.params.page;
    var body = req.body;
    var use = body.use;
    db.query('update consulting set ? where No = ?',[{use:use},page],(err,rows)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

router.post('/consulting_delete_List',(req,res)=>{
    console.log("접속");
    let jsonData = req.body.undefined;
    if(Array.isArray(jsonData)){
        for(let i = 0; i < jsonData.length; i++){
            db.query('delete from `consulting` where No = ?',jsonData[i]);
        }
    }else{
        db.query('delete from `consulting` where No = ?', jsonData);
    }
    
    res.redirect('/adminlist');
});

module.exports = router;