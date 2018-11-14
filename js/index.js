function getRandomPlace(selected_food_tags, callback){
       $.ajax({
        url:  "https://api.myjson.com/bins/wavwc",
        type: 'GET', // http 메소드
        success: function (data){
            var rand_arr = [];
            for(var i = 0; i < data.length; i++){
                for(var tags = 0; tags < selected_food_tags.length; tags++){
                    var tag = selected_food_tags[tags];
					for(var j in data[i]["hash_tags"]){
						if (data[i]["hash_tags"][j] == tag){
							rand_arr.push(data[i]);
							break;
						}	
					}
                }
            }
            rand_arr = rand_arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
			var final_place = rand_arr[Math.floor(Math.random() * rand_arr.length)]["index"];
           	
            
            
            
            
            if (final_place == null){
                alert("해당하는 음식점이 없습니다 ㅜㅜ 다른 태그들을 선택해주세요!!");
            }else{
                callback(final_place, selected_food_tags);
            }
        },
        error: function (err){
            console.log(err);
        }
    });
}

function ClickBtn(selected_food_tags){
    getRandomPlace(selected_food_tags,setUrl);
}

function setUrl(final_place, selected_food_tags){
    let array = Array.from(selected_food_tags);
    var url = "map.html?place=" + final_place + "&tags=" + array.join(",");
    window.location.href=encodeURI(url);
}

$(document).ready(function () {
    $(".menu").click(function () {
        if($(this).attr("check") == "false"){
            $(this).attr("check", true);
            $(this).css("background-color", "white");
            $(this).css("color", "black");
        }else{
            $(this).attr("check", false);
            $(this).css("background-color", "transparent");
            $(this).css("color", "white");
        }
    })
    
    $(".finish-button").click(function () {
        var selected_food_tags = [];
        var food_menus = $(".menu");
        for(var i = 0; i < food_menus.length; i++){
            if (food_menus.eq(i).attr("check") == "true"){
                selected_food_tags[selected_food_tags.length] = food_menus.eq(i).text();
            }
        }
        ClickBtn(selected_food_tags);
    });
});