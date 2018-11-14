$(document).ready(function () {
    $("#place-address").click(function () {
        new daum.Postcode({
        oncomplete: function(data) {
            var fullRoadAddr = data.roadAddress;
            var extraRoadAddr = '';
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
            }
            if(data.buildingName !== '' && data.apartment === 'Y'){
                   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
            }
            if(fullRoadAddr !== ''){
                    fullRoadAddr += extraRoadAddr;
            }
            $("#place-address").attr("value", fullRoadAddr);
            $("#place-address").text = fullRoadAddr;
        }
        }).open(); 
    });
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    
    $("#form").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url:"https://api.myjson.com/bins/wavwc",
            type:"GET",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(data, textStatus, jqXHR){
              // 중복체크
              let DuplicateCheckSet = new Set(); // 
              var place = $("#place-address").val() + " " + $("#ex-place-address").val();
              for (var i = 0; i < data.length;i++){
                  if (data[i]["name"] == $("#place-name").val() || data[i]["address"] == place){
                      DuplicateCheckSet.add("true");
                  }else{
                      DuplicateCheckSet.add("false");   
                  }
              }
                if (DuplicateCheckSet.has("true")){
                    alert("이미 있는 데이터입니다.");
                    window.location.reload();
                }else{
                    info = {
                            "index": data.length+1,
                            "name": $("#place-name").val(),
                            "eng_name": $("#place-eng-name").val(),
                            "address": $("#place-address").val() + " " + $("#ex-place-address").val(),
                            "description": [$("#description").val()],
                            "phone": $("#place-phone").val(),
                            "hash_tags": $("#place-tag").val().replace(/#/gi, "").split(" "),
                            "writer": {
                                "name": $("#writer-name").val(),
                                "email": $("#writer-email").val()
                            },
                            "menus": [
                                {
                                    "name": $("#menu-name-1").val(),
                                    "price": $("#menu-price-1").val()
                                },
                                {
                                    "name": $("#menu-name-2").val(),
                                    "price": $("#menu-price-2").val()
                                },
                                {
                                    "name": $("#menu-name-3").val(),
                                    "price": $("#menu-price-3").val()
                                }
                            ]

                        };
                      data.push(info);
                      var newInfo = data; // 새로
                      $.ajax({
                          url:"https://api.myjson.com/bins/wavwc",
                          type:"PUT",
                          data:JSON.stringify(newInfo),
                          contentType:"application/json; charset=utf-8",
                          dataType:"json",
                          success: function(data, textStatus, jqXHR){
                              // 옛날 서버에ㅇㅆ는 데이터
                              alert("데이터 추가에 성공하셨습니다.");
                          }
                      });  
					return ; 
                    window.location.reload();
                }
                
            }
        }); 
    })
});