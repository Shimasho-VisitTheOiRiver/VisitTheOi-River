//ハンバーガーメニュー
$(function(){
/*
  $("#headera").click(function(){
    $("#headera").slideToggle();
    return false;
  });
*/
  $(window).resize(function(){
    var win = $(window).width();
    var p = 769;
    if(win > p){
      $("#headerb").show();
    } else {
      $("#headerb").hide();
    }
  });
});


//空の配列宣言
var neighborhoods = [" "];
var visitno=[" "];
var visitinfo=[" "];
var visiturl=[" "];

//CSVファイルの読み込み	
$(function() {
  var csvList;
  $.ajax({
    url: './data/visitplace.csv',
    success: function(data) {
    
      // csvを配列に格納
      csvList = $.csv()(data);
      
      // データを別配列に格納
      for (var i = 1; i < csvList.length -1; i++) {
        neighborhoods.push(new google.maps.LatLng(csvList[i][7],csvList[i][8]));
        var no=1;
        visitno.push(String('http://chart.apis.google.com/chart?chst=d_map_spin&chld=1.2|1|'+csvList[i][9]+'|13|_|'+csvList[i][1]));
        visitinfo.push(csvList[i][3]+'</br>'+csvList[i][4]+'</br>'+csvList[i][5]);
        visiturl.push(String(csvList[i][10]));
      };
    }
  });
});

//マーカー用配列
var markers=[];

//地図描画変数
var map;

//mapを表示
function initMap() {
  var myLatLng={lat: 34.934752, lng: 138.183324};
  
  //mapを表示
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: myLatLng
  });
}

//吹き出しを作成し、mouseOver & Outイベント作成
function attachMessage(marker, msg, urls) {
  //infowindowを作成
    var infowin=new google.maps.InfoWindow({
        content: msg
      });
      
  //マウスオーバー処理
    google.maps.event.addListener(marker, 'mouseover', function(event) {
      infowin.open(map, marker);
    });
    
  //マウスアウト処理（マウスが外れたら）
    google.maps.event.addListener(marker, 'mouseout', function(event) {
      infowin.close();
    });
    
  //クリック処理
    google.maps.event.addListener(marker, 'click', function(event){
      location.href = urls;
    });
}


//複数マーカーを表示
function drop() {
  for (var i = 0; i < neighborhoods.length -1; i++) {
    markers.push(new google.maps.Marker({
      position: neighborhoods[i],
      map: map,
      icon: visitno[i],
      zIndex: neighborhoods.length - i,
    }));
    attachMessage(markers[i], visitinfo[i], visiturl[i]);
  }
}
