var express = require('express');
var router = express.Router();
var db = require('../mysql/index').mysql();
var bodyParser = require('body-parser');

var header = require('../layout/header');
var nav = require('../layout/nav');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


router.get('/link',(req,res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/login";
            </script>
        `)
        return;
    }
    db.query('select * from link',(err, rows)=>{
        var naver = "";
        var kakao = "";
        if(err) throw err;

        for(var i = 0; i < rows.length; i++){
            if(rows[i].name == "naver"){
                naver = rows[i].url;
            }
            if(rows[i].name == "kakao"){
                kakao = rows[i].url;
            }
        }

        var render = {
            header:header.header(),
            nav:nav.nav(),
            naver:naver,
            kakao:kakao,
        }


        res.render('link',render);
    });
});

router.post('/link/:page',(req,res)=>{
    var page = req.params.page;
    var body = req.body;
    var url = body.url;
    var linkName = (page == "naver" ? "네이버톡톡" : "카카오톡");
    db.query("update link set ? where name = ?",[{url:url},page],(err,rows)=>{
        if(err) throw err;
        res.send(`
            <script>
                alert("${linkName} 링크 변경이 완료되었습니다.");
                location.href="/link";
            </script>
        `)
    });
});


module.exports = router;