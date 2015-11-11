function fromhere() {
  var initialLocation;
  var defaultLocation = new google.maps.LatLng(34.834752,138.183324);
  var url = 'http://maps.google.co.jp/maps?f=d&source=s_d&saddr=FROMLAT,FROMLNG&daddr=%e5%a4%a7%e9%98%aa%e5%b8%82%e6%b7%80%e5%b7%9d%e5%8c%ba%e8%a5%bf%e4%b8%ad%e5%b3%b67%e4%b8%81%e7%9b%ae1%2d29'; //

  // 現在地取得
  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportGetlocationFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      jumpMapURL();
    }, function(error) {
      handleNoGeolocation(browserSupportGetlocationFlag,error);
    }, {enableHighAccuracy:true} // androidはこのオプションが必要
    );
  }
  // Try Google Gears Geolocation
  else if (google.gears) {
    browserSupportGetlocationFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      jumpMapURL();
    }, function(error) {
      handleNoGeoLocation(browserSupportGetlocationFlag,error);
    }, {enableHighAccuracy:true} // androidはこのオプションが必要
    );
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportGetlocationFlag = false;
    handleNoGeolocation(browserSupportGetlocationFlag,false);
  }

  function jumpMapURL() {
    var lat       = initialLocation.lat();
    var lng       = initialLocation.lng();
    url = url.replace(/FROMLAT/, lat);
    url = url.replace(/FROMLNG/, lng);
    location.href = url;
  }

  function handleNoGeolocation(errorFlag,error) {
    if (errorFlag == true) {
      alert("現在位置取得サービスがエラーを返しました\n"+
          'コード: '    + error.code    + '\n' +
          'メッセージ: ' + error.message + '\n');
      initialLocation = defaultLocation;
    } else {
      alert("現在位置取得機能がございません。代わりに東京を表示しておきます。");
      initialLocation = defaultLocation;
    }
    jumpMapURL();
  }
}