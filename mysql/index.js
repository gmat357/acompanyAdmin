exports.mysql = ()=>{
    var mysql = require('mysql');
    var db = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'speed',
        database:'speed_34'
    });

    return db;
}