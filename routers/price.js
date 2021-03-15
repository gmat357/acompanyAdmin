var express = require('express');
var router = express.Router();
var db = require('../mysql/index').mysql();
var bodyParser = require('body-parser');

var header = require('../layout/header');
var nav = require('../layout/nav');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.get('/price',(req,res)=>{
    if(!req.user){
        res.send(`
            <script>
                alert("잘못된 접근입니다.");
                location.href="/login";
            </script>
        `)
        return;
    }
    db.query('select * from price',(err,rows)=>{
        if(err) throw err;
        var render = {
            header:header.header(),
            sk:rows[0].value,
            kt:rows[2].value,
            lg:rows[1].value,
            nav:nav.nav(),
        }
        res.render('price',render);
    });

});

router.post('/price/:page',(req,res)=>{
    var page = req.params.page;
    var body = req.body;
    var price = JSON.stringify(body.price);
    db.query('update price set ? where name = ?',[{value:price},page],(err,rows)=>{
        res.send(`
            <script>
                alert("수정이 완료되었습니다.");
                location.href="/price";
            </script>
        `)
    });
});



module.exports = router;