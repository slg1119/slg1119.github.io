var urlParameter = new URLSearchParams(window.location.search);
var target_id = urlParameter.get("place");
var selected_tags = urlParameter.get("tags").split(",");
var target_info, place_name,place_address = null;

function getRandomPlace(selected_food_tags, callback){
        $.ajax({
        url:  "https://api.myjson.com/bins/wavwc",
        type: 'GET',
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
            
            
            
            if (final_place == target_id){
                if(rand_arr.length == 1){
                    alert("해당하는 또다른 음식점이 없습니다.")
                }else{
                    getRandomPlace(selected_food_tags,setUrl);
                }  
            }else{
               callback(final_place,selected_food_tags); 
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

function daummapapi(place_address,place_name){
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

    // 지도를 생성합니다    
    var map = new daum.maps.Map(mapContainer, mapOption); 

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new daum.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(place_address, function(result, status) {

        // 정상적으로 검색이 완료됐으면 
         if (status === daum.maps.services.Status.OK) {

            var coords = new daum.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new daum.maps.Marker({
                map: map,
                position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new daum.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">' + place_name +'</div>'
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        } 
    });    
}

$(document).ready(function () {
    $.ajax({
        url: "https://api.myjson.com/bins/wavwc",
        type: "GET",
        success: function (data){
            for (var i=0; i<data.length;i++){
                if (target_id == data[i]["index"]){
                    target_info = data[i];
                }
            }
            document.title = "PTU푸드맵 | " + target_info.name;
            $('meta[name=og\\:title]').attr('content', "PTU푸드맵 | " + target_info.name);
            $("#name").text(target_info.name);
            var tag = "";
            target_info.hash_tags.forEach(function (e) {
               tag += "#" + e + " "; 
            });
            $("#tags").text(tag);
            $("#description").text(target_info.description);
            $("#address").text(target_info.address);
            $("#phone").text(target_info.phone);
            target_info.menus.forEach(function (a) {
                $("#menus").append("<li>" + a.name + " : " + a.price + "원</li>");
            });
            
            place_name = target_info["name"];
            place_address = target_info["address"];
            daummapapi(place_address,place_name);
        },
        error: function (err){
            console.log(err);
        }
    });
    $("#other").click(function () {
        ClickBtn(selected_tags);
    })
    $("#hrmain").click(function () {
        location.href = "index.html";
    })
});



