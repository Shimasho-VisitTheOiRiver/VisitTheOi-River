//マーカー配列
/*
var neighborhoods = [
  {lat: 34.824029, lng: 138.139015},
  {lat: 34.85686, lng: 138.11496},
  {lat: 34.919349, lng: 138.125798},
  {lat: 34.943512, lng: 138.1087347},
  {lat: 34.11012, lng: 138.13864},
  {lat: 34.959222, lng: 138.04717},
  
];
*/

var neighborhoods = [];

var markers=[];
var map;

//mapを表示
function initMap() {
  var myLatLng={lat: 34.834752, lng: 138.183324};
  
  //mapを表示
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: myLatLng
  });
  
  //現在地マーカーを表示
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: myLatLng
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

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
}


/*
//複数マーカーを表示
function drop() {
  for (var i = 0; i < neighborhoods.length; i++) {
    addMarkerWithTimeout(neighborhoods[i], i * 200);
  }
}

//マーカーアニメーション制御
function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}
*/

function drop(){
  //CSVファイルの読み込み	
  $(function() {
      //var target = '#news';
      var csvList;
      var insert = '';
      $.ajax({
          url: './data/373.csv',
          success: function(data) {
   
              // csvを配列に格納
              csvList = $.csv()(data);
   
              // 挿入するHTMLを作成
              for (var i = 1; i < csvList.length; i++) {

                  /*
                  var lat=csvList[i][7];
                  val lng=csvList[i][8];
                  val name=csvList[i][0];
                  
                  
                  map.addOverlay(createMarker(lat,lng,name));
                  
                  function createMarker(lat,lng,name){
                  */
                  var marker1=new google.maps.Marker({
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(csvList[i][7],csvList[i][8])
                  });

                  marker1.addListener('click', function() {
                    infowindow1.open(map, marker1);
                  });

                  var html="<p>"+csvList[i][0]+"</p>";
                  var infowindow1 = new google.maps.InfoWindow({
                    content: html
                  });
  /*
                  insert += '<li id="' + csvList[i][0] + '">';
                  insert += '<p class="name">' + csvList[i][0] + '</p>';
                  insert += '<p class="lat">' + csvList[i][7] + '</p>';
                  insert += '<p class="lng">' + csvList[i][8] + '</p>';
                  insert += '</li>';
  */
              };
              //$(target).append(insert);
            }
      });
  });
  																/*
  																    for(var i=0;i<lines.length;i++){
  																      var vals=lines[i].split(",");

  																      var lat=vals[1];
  																      val lng=vals[2];
  																      val name=vals[0];
  																      
  																      //neighborhoods[i]=new google.maps.LatLng({lat,lng});
  																      map.addOverlay(createMarker(lat,lng,name));
  																    }
  																  });
  																}
  																

  function createMarker(lat,lng,name){
    var marker1=new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat,lng)
    });

    marker1.addListener('click', function() {
      infowindow1.open(map, marker1);
    });

    var html="<p>"+name+"</p>";
    var infowindow1 = new google.maps.InfoWindow({
      content: html
    });
    

    return marker1;
  } 
}*/
