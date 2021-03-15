exports.mysql = ()=>{
    var mysql = require('mysql');
    var db = mysql.createConnection({
        host:'daesunga.cafe24app.com',
        user:'daesung1080',
        password:'eotjdzjavjsl!',
        database:'daesung1080'
    });

    return db;
}