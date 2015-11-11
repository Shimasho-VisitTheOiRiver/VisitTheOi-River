//空の配列宣言
var neighborhoods = [" "];
var visitno=[" "];
var visitinfo=[" "];

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
        neighborhoods.push(new google.maps.LatLng(csvList[i][5],csvList[i][6]));
        var no=1;
        visitno.push(String('http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0.25|'+csvList[i][7]+'|13|_|'+csvList[i][1]));
        visitinfo.push(String(csvList[i][3]));
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
  
/*
  //現在地マーカーを表示
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: myLatLng,
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  
  //マーカー吹き出し
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">島田商業</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';
  
  //吹き出し表示
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  
*/

}


function attachMessage(marker, msg) {
    google.maps.event.addListener(marker, 'click', function(event) {
      new google.maps.InfoWindow({
        content: msg
      }).open(marker.getMap(), marker);
    });
  }

//複数マーカーを表示
function drop() {
  for (var i = 0; i < neighborhoods.length -1; i++) {
    markers.push(new google.maps.Marker({
      position: neighborhoods[i],
      map: map,
      icon: visitno[i],
    }));
    attachMessage(markers, visitinfo[i]);
  }
}




/*
//複数マーカーを表示
function drop() {
  for (var i = 0; i < neighborhoods.length -1; i++) {
    addMarkerWithTimeout(neighborhoods[i], i, visitno[i], visitinfo[i]);
  }
}

//マーカーアニメーション制御
function addMarkerWithTimeout(position, timeout, labels, visitinfo) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      icon: labels,
    }));
  }, timeout);
}


複数マーカーに吹き出し
for (var i = 0; i < markers.length; i++) {
    markers[i].addListener('click', function() {
      placeinfowindow.open(map, markers[i]);
    });

    var placeinfowindow = new google.maps.InfoWindow({
      content:visitinfo[i]
    });
}
*/
