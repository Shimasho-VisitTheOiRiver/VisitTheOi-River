//ハンバーガーメニュー
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

//--------------------------------------------------------------------------------------------------------------------マーカークリック回数を記録し別ページに飛ぶアクションの変数
var clicks=0;
var zoom=1;

//--------------------------------------------------------------------------------------------------------------------他のinfowinがあればcloseするための変数
var currentInfowin=null;

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
        visitinfo.push('<div id="infowindow">'+csvList[i][4]+'</br><a href="http://maps.google.com/maps?daddr='+csvList[i][8]+','+csvList[i][9]+'&saddr=%E7%8F%BE%E5%9C%A8%E5%9C%B0&dirflg=d&t=m">　現在地からルート検索</a>');
        visiturl.push(String(csvList[i][11]));
      };
       for (var i = 1; i < csvList.length-1; i++) {
                insert += '<li id="visitlistli' + csvList[i][0] + '">';
                insert += '<div class="image"><a href="javascript:{window.scrollTo( 0 , 215 );map.setZoom(18);map.panTo(new google.maps.LatLng'+ neighborhoods[i] +');}"><img src="' + csvList[i][12] + '" />'+ csvList[i][3] +'</div>';
                insert += '<p class="sentence">'+'　　[' + csvList[i][2] + ']</p></a>';
                insert += '</li>';
                zoom=map.getZoom();
                clicks=1;
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
function attachMessage(marker, msg, urls, latlng) {
  //infowindowを作成
    var infowin=new google.maps.InfoWindow({
        content: msg
      });
      
  //---------------------------------------------------------------------------------マウスオーバーでinfowinを開く&別のinfowinを閉じる
    google.maps.event.addListener(marker, 'mouseover', function(event) {
      if (currentInfowin) {
      	currentInfowin.close();
      }
      infowin.open(map, marker);
      currentInfowin=infowin;
    });
  //---------------------------------------------------------------------------------クリック処理（mapのzoomによって処理を変える）
    google.maps.event.addListener(marker, 'click', function(event){
      zoom=map.getZoom();
      map.panTo(latlng);
      map.setZoom(18);
      if(clicks==1 && zoom<18){
      	clicks=0;
      }else if(clicks==1 && map.getZoom()==18){
      	location.href = urls;
      }
      else{
      	clicks=1;
      }
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
    attachMessage(markers[i], visitinfo[i], visiturl[i], neighborhoods[i]);
  }
}

