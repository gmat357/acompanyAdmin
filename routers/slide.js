var express = require('express');
var router = express.Router();
var db = require('../mysql/index').mysql();
var bodyParser = require('body-parser');

var header = require('../layout/header');
var nav = require('../layout/nav');

var multer = require('multer');
var path = require('path');
var fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname,'../public/upload/img'));
    },
    filename : function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, path.basename("a-company",ext) + new Date().valueOf() + ext);
    }
});

var upload = multer({storage:storage});

router.get('/slide',(req,res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/login";
            </script>
        `)
        return;
    }
    db.query('select * from slide',(err,rows)=>{
        if(err) throw err;
        var render = {
            header:header.header(),
            slide1:rows[0].url,
            slide2:rows[1].url,
            slide3:rows[2].url,
            nav:nav.nav(),
        }
        res.render('slide',render);
    });

});

router.post('/slide/:page',upload.single('file'),(req,res)=>{
    var page = req.params.page;
    var filePath = `/public/upload/img/${req.file.filename}`;
    if(req.file.filename == undefined){
        res.send(`
            <script>
                alert("슬라이드 이미지가 없습니다.");
                history.back();
            </script>
        `)
    }
    db.query(`update slide set ? where name = ?`,[{url:filePath},page],(err,rows)=>{
        if(err) throw err;
        res.redirect('/slide');
    });
})


module.exports = router;