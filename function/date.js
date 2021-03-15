exports.date = ()=>{
    var nowDate = new Date();
    var year = nowDate.getFullYear() + '-';
    var month = (nowDate.getMonth()+1) + '-';
    var date = nowDate.getDate();
    var hour = " " + nowDate.getHours() + ":";
    var min = nowDate.getMinutes() + ":";
    var sec = nowDate.getSeconds();
    
    if(String(month).length == 2){
        month = "0" + month;
    }
    if(String(date).length == 1){
        date = "0" + date;
    }
    if(String(min).length == 2){
        min = "0" + min;
    }
    if(String(sec).length == 1){
        sec = "0" + sec;
    }

    var day = year + month + date + hour + min + sec;
    return day;
}