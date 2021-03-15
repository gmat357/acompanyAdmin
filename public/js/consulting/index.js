var dataGetUrl = "/consulting/getList"; // 데이터를 가져올 링크
var urlType = "post"; // 데이터 방식 GET/POST
var dataType = "json"; // 데이터 형식
var maxTableColspan = 6; // 테이블 열의 갯수
var maxListLength = 15; // 보여주는 리스트 갯수
var pagingBtnLength = 5; // 페이징 버튼 갯수
var btnClickColor = "#545454"; // 페이징 버튼 클릭시 색상
var btnColor = "white";
var pagingBox = $(".paging_box"); // 페이징 박스 엘리먼트
var prev = $(".prev"); // 이전 버튼 엘리먼트
var next = $(".next"); // 다음 버튼 엘리먼트
var listContainer = $(".list_container"); // 데이터를 넣을 컨테이너 엘리먼트

listContainer.children("tbody").addClass("list_space");

function failedGetData(){
    return "<tr><td colspan="+maxTableColspan+">게시물 없음</td></tr>";
}

function successGetData(data){
    var dataList = "";
    for(var i = 0; i < maxListLength && i < data.length; i++){
        var useImg = "../public/img/main/false.png";
        if(data[i].use == "완료")
            useImg = "../public/img/main/true.png";
        dataList += `
        <tr>
        <td>${data[i].No}</td>
        <td>${data[i].name}</td>
        <td>${data[i].insert_date}</td>
        <td>${data[i].category}</td>
        <td><span value="${data[i].No}" class="consulting_btn">${data[i].title}</span></td>
        <td><img src="${useImg}" alt="상태이미지"/></td>
        </tr>
        `
    }
    return dataList;
}

function pagingCreate(data,page){
    var pagingList = "";
    var maxList = 0;
    if(page <= 1)
        page = 0;
    for(var i = page; i < (data.length / maxListLength); i++){
        maxList++;
        if(maxList <= pagingBtnLength){
            pagingList += `<span class="paging_btn" value="${i+1}">${i+1}</span>`
        }
    }
    prev.after(pagingList);
}

function resetData(data,page){
    var listSpace = $(".list_space");
    listSpace.empty();
    var dataList = "";
    for(var i = (page - 1) * maxListLength; i < maxListLength * page; i++){
        if(data[i] == undefined){
            continue;
        }else{
            dataList += `
            <tr>
            <td>${data[i].No}</td>
            <td>${data[i].name}</td>
            <td>${data[i].insert_date}</td>
            <td>${data[i].category}</td>
            <td><span value="${data[i].No}" class="consulting_btn">${data[i].title}</span></td>
            <td>${data[i].use}</td>
            </tr>
            `
        }
    }
    listSpace.append(dataList);
}

function prevClick(data){
    var pagingBtn = $(".paging_btn");
    var pagingBtnValue = Number(pagingBtn.first().attr('value'));
    var pagingCreatePageResult = ((pagingBtnValue - pagingBtnLength) - 1);
    var resetDataPageResult = (pagingBtnValue - pagingBtnLength);
    if(pagingBtnValue <= 1 || pagingBtnValue - pagingBtnLength < 1){
        return;
    }else{
        pagingBtn.remove();
        pagingCreate(data, pagingCreatePageResult);
        resetData(data, resetDataPageResult);
        $(`.paging_btn[value=${resetDataPageResult}]`).css("backgroundColor",btnClickColor).css("color",btnColor);
    }
}

function nextClick(data){
    var pagingBtn = $(".paging_btn");
    var pagingBtnValue = Number(pagingBtn.last().attr('value'));

    if(pagingBtnValue >= data.length / maxListLength){
        return;
    }else{
        pagingBtn.remove();
        pagingCreate(data, pagingBtnValue);
        resetData(data, pagingBtnValue + 1);
        $(`.paging_btn[value=${pagingBtnValue+1}]`).css("backgroundColor",btnClickColor).css("color",btnColor);
    }
}

function pagingClick(data){
    var pagingBtn = $(".paging_btn");
    pagingBtn.each(function(){
        $(this).on("click",function(){
            pagingBtn.removeAttr("style");
            var page = $(this).attr("value");
            $(this).css({"backgroundColor":btnClickColor,"color":btnColor,"transitionDuration":"0.3s"});
            resetData(data,page);
        });
    });
}

// IE
function getConsulting(value){
    $.ajax({
        url:"/consulting/"+value,
        type:"post",
        success:function(data){
            var categoryForm = $(".category");
            var nameForm = $(".name");
            var phoneForm = $(".phone");
            var textForm = $(".text_form");
            var dateForm = $(".assignment_date");
            var useForm = $(".use > option");
            var updateAction = $(".update_action");

            categoryForm.attr("value",data[0].category);
            nameForm.attr("value",data[0].name);
            phoneForm.attr("value",data[0].phone);
            dateForm.attr("value",data[0].insert_date);
            textForm.text(data[0].category);
            updateAction.attr("action","/consultingUpdate/"+data[0].No);

            for(var i = 0; i < useForm.length; i++){
                if(useForm.eq(i).val() == data[0].use){
                    useForm.eq(i).prop("selected",true);
                }
            }
        }
    })
}

$(function(){
    var list_space = $(".list_space");
    
    $.ajax({
        url:dataGetUrl,
        type:urlType,
        dataType:dataType,
        success:function(data){
            var list_clone = "";
            if(data.length <= 0)
            list_clone = failedGetData();
            else
            list_clone = successGetData(data);
            
            list_space.append(list_clone);
            pagingCreate(data,0);
            $(".paging_btn").eq(0).css("background-color",btnClickColor).css("color",btnColor);
            prev.on("click",function(){
                prevClick(data)
            });
            next.on("click",function(){
                nextClick(data)
            });
            pagingBox.on("mouseover", function(){
                pagingClick(data);
            });


            //  IE는 분리안되는 오류 수정못해서 여기에 작성
            var consulting_btn = $(".consulting_btn");
            var updateForm = $(".update_box");
            var updateFormClose = $(".form_close_btn");
            consulting_btn.each(function(){
                $(this).on("click", function(){
                    var value = $(this).attr("value");
                    getConsulting(value);
                    updateForm.fadeIn();
                });
            })
            updateFormClose.on("click",function(){
                updateForm.fadeOut();
            });

        },error:function(){
            console.log("Failed to fetch Data");
        }
    });
});

