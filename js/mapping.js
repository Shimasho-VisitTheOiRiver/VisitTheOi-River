﻿//ハンバーガーメニュー
$(function(){
  $("#toggle").click(function(){
    $("#headmid").slideToggle();
    return false;
  });
  $("#headmid li:nth-child(1)").click(function(){
    $("#headmid").slideToggle();
    return true;
  });
  $(window).resize(function(){
    var win = $(window).width();
    var p = 769;
    if(win > p){
      $("#headerb").show();
      $("#headmid").show();
      $("#toggle").hide();
    } else {
      $("#headerb").hide();
      $("#headmid").hide();
      $("#toggle").show();
    }
  });
});


//空の配列宣言
var neighborhoods = [" "];
var visitno=[" "];
var visitinfo=[" "];
var visiturl=[" "];
//var visitlist=[" "];

//CSVファイルの読み込み	
$(function() {
  var csvList;
  var target = '#visitlist';
  var insert = '';
  $.ajax({
    url: './data/visitplace.csv',
    success: function(data) {
    
      // csvを配列に格納
      csvList = $.csv()(data);
      
      // データを別配列に格納
      for (var i = 1; i < csvList.length -1; i++) {
        
        //-------------------------------------------------------------------------------------------------------------座標重複時にLngをプラス方向にずらす
        var lng='';
        var flg=0;
        for(var j=1;j<i;j++){
          if(csvList[i][8]==csvList[j][8] && csvList[i][9]==csvList[j][9]){
            flg=1;
          }
        }
        
        if(flg==1){
            lng=Number(csvList[i][9])+0.00005;
        }else{
            lng=csvList[i][9];
        }
        
        neighborhoods.push(new google.maps.LatLng(csvList[i][8],lng));
        var no=1;
        visitno.push(String(csvList[i][12]));
        visitinfo.push('<div id="infowindow">'+csvList[i][4]+'</br>'+csvList[i][5]+'</br>'+csvList[i][6]+'</div>');
        visiturl.push(String(csvList[i][11]));
        //visitlist.push(String(csvList[i][3]+'  【'+csvList[i][2])+'】'));
      };
       for (var i = 1; i < csvList.length-1; i++) {
                insert += '<li id="' + csvList[i][0] + '">';
                insert += '<div class="image"><a href="'+ csvList[i][11] +'"><img src="' + csvList[i][12] + '" />'+ csvList[i][3] +'</div>';
                insert += '<p class="sentence">'+'　　[' + csvList[i][2] + ']</p></a>';
                insert += '</li>';
            };
            $(target).append(insert);
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
