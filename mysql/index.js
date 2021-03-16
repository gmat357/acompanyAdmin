exports.mysql = ()=>{
    var mysql = require('mysql');
    var db = mysql.createConnection({
        host:'daesunga.cafe24app.com',
        user:'daesung1080',
        password:'eotjdzjavjsl!',
        database:'daesung1080'
    });

    function handleDisconnect() {
        db.connect(function(err) {            
          if(err) {                            
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); 
          }                                   
        });                                 
                                               
        db.on('error', function(err) {
          console.log('db error', err);
          if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            return handleDisconnect();                      
          } else {                                    
            throw err;                              
          }
        });
      }
      
      handleDisconnect();

    return db;
}