
/*
 * 位置情報を操作する機能を提供します。
 * [Ref]
 *   ・計算式 <http://vldb.gsi.go.jp/sokuchi/surveycalc/algorithm/>
 *   ・二地点の緯度・経度からその距離を計算する：日本は山だらけ～ 技術研究本部 報告書 #1 <http://yamadarake.web.fc2.com/trdi/2009/report000001.html>
 *   ・02 DATUM <http://homepage3.nifty.com/Nowral/02_DATUM/02_DATUM.html>
 * [Usage]
 *   var tokyoPos;
 *   // 日本測地系(deg)として位置情報を取得
 *   tokyoPos = new Geo.Position(35.6554639, 139.7486389, { type: Geo.Datum.Type.tokyo });
 *   // 日本測地系(dms)として位置情報を取得
 *   //tokyoPos = new Geo.Position('43/02/19.020', '141/28/34.282', { type: Geo.Datum.Type.tokyo });
 *   // 日本測地系(millisec)として位置情報を取得
 *   //tokyoPos = new Geo.Position(Geo.Angle.milisec2dms(154939020), Geo.Angle.milisec2dms(509314282), { type: Geo.Datum.Type.tokyo });
 *   // 日本測地系の緯度・経度
 *   console.log('日本測地系: ' + tokyoPos.tokyo.lat.toDeg() + ', ' +  tokyoPos.tokyo.lng.toDeg());
 *   // 世界測地系の緯度・経度
 *   console.log('世界測地系: ' + tokyoPos.wgs84.lat.toDeg() + ', ' +  tokyoPos.wgs84.lng.toDeg());
 */
(function(){
  var Geo = {};
  /**
   * 2地点の距離計算(m)を返す。
   * @param posA A地点のGeo.Positionオブジェクト
   * @param posB B地点のGeo.Positionオブジェクト
   * @param opt { type: Geo.Datum.Type.wgs84 }
   * @return 2地点の距離(m)
   * @type number
   */
  Geo.distance = function(posA, posB, opt) {
    if (!posA || !posB) {
      return false;
    }
    var datum, 
      datumA, latA, lngA, 
      datumB, latB, lngB,
      latAve, latDiff, lngDiff, sl, meridian, primevertical, x, y, 
      type = (opt && opt.type == Geo.Datum.Type.tokyo) ?
        Geo.Datum.Type.tokyo : Geo.Datum.Type.wgs84;
    if (type == Geo.Datum.Type.wgs84) {
      datumA = posA.wgs84;
      datumB = posB.wgs84;
    } else if (type == Geo.Datum.Type.tokyo) {
      datumA = posA.tokyo;
      datumB = posB.tokyo;
    } else {
      throw 'cannot found type.';
    }
    datum = datumA;
    latA = datumA.lat.toRadian();
    lngA = datumA.lng.toRadian();
    latB = datumB.lat.toRadian();
    lngB = datumB.lng.toRadian();
    // 緯度の平均
    latAve = (latA + latB) / 2;
    // 緯度の差
    latDiff = latA - latB;
    // 緯度の差
    lngDiff = lngA - lngB;
    sl = Math.sin(latAve), w = 1 - datum.E2 * sl * sl;
    // 子午線曲率半径
    meridian = datum.a / Math.sqrt(Math.pow(w, 3))
    // 卯酉線曲率半径
    primevertical = datum.A / Math.sqrt(w);
    // Hubenyの公式
    x = meridian * latDiff;
    y = primevertical * Math.cos(latAve) * lngDiff;
    return Math.sqrt(x * x + y * y);
  };

  /**
   * 角度情報
   */
  Geo.Angle = function(/* deg, min, sec, milisec */) {
    this.initialize.apply(this, arguments);
  };
  Geo.Angle.prototype = {
    /** 度 */
    deg: 0,
    /** 分 */
    min: 0,
    /** 秒 */
    sec: 0,
    /** ミリ秒 */
    milisec: 0.0,
    /**
     * 初期化します。
     * @param deg 度
     * @param min 分
     * @param sec 秒
     * @param millisec ミリ秒
     */
    initialize: function(deg, min, sec, milisec) {
      this.deg = parseInt(deg);
      if(!!min) {
        this.min = parseInt(min);
      }
      if(!!sec) {
        this.sec = parseInt(sec);
      }
      if(!!milisec) {
        this.milisec = parseFloat(milisec);
      }
      this.normalize();
    },
    /** 正規化。桁あふれを直す */
    normalize: function() {
      this.milisec = this.milisec % 1000;
      this.sec += parseInt(this.milisec / 1000);
      this.sec = this.sec % 60;
      this.min += parseInt(this.sec / 60);
      this.min = this.min % 60;
      this.deg += parseInt(this.min / 60);
    },
    /**
     * ミリ秒で返す。
     * @return ミリ秒。
     * @type number
     */
    toMilisec: function() {
      return (this.deg * 3600.0 + this.min * 60.0 + this.sec) * 1000.0 + this.milisec;
    },
    /**
     * degreeで返す。
     * @return degree。
     * @type number
     */
    toDeg: function() {
      return (this.milisec / 1000.0 + this.sec) / 3600.0 + this.min / 60.0 + this.deg;
    },
    /**
     * dms(ddd.mm.ss.sss)形式で返す。
     * @return dms(ddd.mm.ss.sss)形式。
     * @type string
     */
    toDms: function(digit) {
      return Geo.Angle.deg2dms(this.toDeg(), digit);
    },
    /**
     * radianで返す。
     * @return radian。
     * @type number
     */
    toRadian: function() {
      return Geo.Angle.deg2rad(this.toDeg());
    },
    /**
     * このオブジェクトが保持するdeg,min,sec,milisecの配列を返す。
     * @return deg,min,sec,milisecの配列。
     * @type Array
     */
    toArray: function() {
      return [this.deg, this.min, this.sec, this.milisec];
    }
  };
  /** 
   * 角度情報(number:deg, string:dmsと解釈)からAngleオブジェクトを生成して返す。
   * @param arg number:deg, string:dmsと解釈
   * @return Angleオブジェクト
   * @type Angle
   */
  Geo.Angle.parse = function(arg) {
    var arr, ms = 0.0, m;
    if (typeof(arg) == 'number') {
      // deg
      if (parseInt(arg) < parseFloat(arg)) { // float
        arr =Geo.Angle.deg2dmsArray(arg)
        return new Geo.Angle(arr[0], arr[1], arr[2], arr[3]);
      } else { // integer
        return new Geo.Angle(arg);
      }
    } else if (typeof(arg) == 'string') { // string
      // dms string  : '35.59.59', '36.0.0.001', '35/01/23', '35'01'23'
      m = arg.match(/(\d+)[\.\/'](\d+)[\.\/'](\d+)([\.\/']\d+)?/); //'
      if (!!m) {
        if (!!m[4]) {
          ms = parseFloat('0.' + m[4].substring(1, m[4].length)) * 1000.0;
        }
        return new Geo.Angle(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), ms);
      } else {
        // ddmmss.ss string : '360000', '360101.001', '1400000', '01405959'
        m = arg.match(/(\d+)(\.(\d+))?$/);
        if (!!m) {
          if (m[1].length > 4) {
            if (m[3] != null) {
              ms = parseFloat(m[3]);
            }
            m = m[1].match(/(\d+)(\d\d)(\d\d)$/);
            return new Geo.Angle(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), ms);
          } else {
            return new Geo.Angle(parseFloat(m[0]));
          }
        } else {
          throw 'error:cannnot parse Angle.';
        }
      }
    } else { // other
      throw 'error:cannnot parse Angle.';
    }
  };
  /**
   * ミリ秒から[度, 分, 秒, ミリ秒]への変換
   * @param milisec ミリ秒
   * @return [度, 分, 秒, ミリ秒]Array
   * @type Array
   */
  Geo.Angle.milisec2dmsArray = function(milisec) {
    if (!milisec || isNaN(milisec)) {
      return null;
    }
    var ms = parseFloat(milisec),
      func = ms < 0 ? Math.ceil : Math.floor,
      s  = Math.abs(func(ms / 1000.0) % 60),
      m  = Math.abs(func(ms / 60000.0) % 60),
      d  = func(ms / 3600000.0);
    ms = Math.abs(ms % 1000.0);
    return [d, m, s, ms];
  };
  /**
   * ミリ秒から'dddmmss.sss'形式の文字列を生成して返す。
   * @param milisec ミリ秒
   * @param digit 有効桁数
   * @return 'dddmmss.sss'形式の文字列
   * @type string
   */
  Geo.Angle.milisec2dms = function(milisec, digit) {
    return Geo.Angle.dmsFormat(Geo.Angle.milisec2dmsArray(milisec), digit);
  };
  /**
   * degree(10進数)からradian(角度)への変換
   * @param deg degree
   * @return 角度を表す数値
   * @type number
   */
  Geo.Angle.deg2rad = function(deg) {
    return (deg / 180) * Math.PI;
  };
  /**
   * degree(10進数)から[度, 分, 秒, ミリ秒]への変換
   * @param deg degree
   * @return 角度を表す数値
   * @type Array
   */
  Geo.Angle.deg2dmsArray = function(deg) {
    var ms = deg * 3600000.0;
    return Geo.Angle.milisec2dmsArray(ms);
  };
  /**
   * degree(10進数)から '度分秒.ミリ秒'への変換 digitが指定されていない場合は小数第3位で四捨五入
   * @param deg degree
   * @param digit 有効桁数
   * @return 角度を表す数値
   * @type string
   */
  Geo.Angle.deg2dms = function(deg, digit) {
    return Geo.Angle.dmsFormat(Geo.Angle.deg2dmsArray(deg), digit);
  };
  /**
   * dms('dddmmss.sss'形式の文字列)を生成して返す。
   * @param arr 度, 分, 秒, ミリ秒の順のArray
   * @param digit 有効桁数
   * @return 角度を表す数値
   * @type string
   */
  Geo.Angle.dmsFormat = function(arr, digit) {
    if (!arr || arr.length != 4) {
      return null;
    }
    if (!digit) {
      digit = 3;
    }
    var ms = '0.' + ('' + arr[3]).replace('.', '');
    ms = (digit == 0 ? ms : Math.round(ms * Math.pow(10, digit)) / Math.pow(10, digit));
    return '' +
      arr[0] +
      ('00' + arr[1]).substr(('00' + arr[1]).length - 2, 2) +
      ('00' + arr[2]).substr(('00' + arr[2]).length - 2, 2) +
      '.' +
      ('' + ms).replace('0.', '');
  };
  /**
   * dms('dddmmss.ss'形式)の緯度，経度を'degree'形式に変換
   * @param dms dms('dddmmss.sss'形式の文字列)
   * @return degree
   * @type number
   */
  Geo.Angle.dms2deg = function(dms) {
    dms = dms + '';
    return Geo.Angle.parse(dms).toDeg();
  };

  Geo.Datum = {};
  /** 測地系の種類 */
  Geo.Datum.Type = {
    wgs84: 0,
    tokyo: 1
  };
  /**
   * 測地系情報
   */
  Geo.Datum.Base = function(/* lat, lng */) {
    this.initialize.apply(this, arguments);
  };
  Geo.Datum.Base.prototype = {
    /** 長半径(赤道半径) [m] */
    A : 0.0,
    /** 短半径(極半径) [m] */
    B : 0.0,
    /** A(1-E2) */
    a : 0.0,
    /** 扁平率 */
    F : 0.0,
    /** (第1離心率e)^2 */
    E2: 0.0,
    /** 緯度のAngleオブジェクト */
    lat: null,
    /** 経度のAngleオブジェクト */
    lng: null,
    /**
     * 初期化します。
     * @param lat 緯度(deg)
     * @param lng 経度(deg)
     */
    initialize: function(lat, lng) {
      this.E2 = this.getE2();
      this.setLatLng(lat, lng);
    },
    /**
     * (第1離心率e)^2を取得します。
     * @return (第1離心率e)^2
     * @type number
     */
    getE2: function() {
      return 2 * this.F - Math.pow(this.F, 2);
    },
    /**
     * 緯度,経度を設定します。
     * @param lat 緯度(deg)
     * @param lng 経度(deg)
     */
    setLatLng: function(lat, lng) {
      if (!!lat && !!lng) {
        this.lat = Geo.Angle.parse(lat);
        this.lng = Geo.Angle.parse(lng);
      }
    }
  };

  /**
   * 世界測地系情報
   */
  Geo.Datum.WGS84 = function(/* lat, lng */) {
    this.initialize.apply(this, arguments);
  };
  Geo.Datum.WGS84.prototype = new Geo.Datum.Base(); // prototype上書き
  /** 長半径(赤道半径) [m] */
  Geo.Datum.WGS84.prototype.A = 6378137.0;
  /** 短半径(極半径) [m] */
  Geo.Datum.WGS84.prototype.B = 6356752.314;
  /** A(1-E2) */
  Geo.Datum.WGS84.prototype.a = 6335439.327;
  /** 扁平率 */
  Geo.Datum.WGS84.prototype.F = 1 / 298.257223;

  /**
   * 日本測地系情報
   */
  Geo.Datum.Tokyo = function(/* lat, lng */) {
    this.initialize.apply(this, arguments);
  };
  /** 世界測地系を基準とした並行移動量 x [m] */
  Geo.Datum.Tokyo.Dx = -148;
  /** 世界測地系を基準とした並行移動量 y [m] */
  Geo.Datum.Tokyo.Dy = +507;
  /** 世界測地系を基準とした並行移動量 z [m] */
  Geo.Datum.Tokyo.Dz = +681;
  Geo.Datum.Tokyo.prototype = new Geo.Datum.Base(); // prototype上書き
  /** 長半径(赤道半径) [m] */
  Geo.Datum.Tokyo.prototype.A = 6377397.155;
  /** 短半径(極半径) [m] */
  Geo.Datum.Tokyo.prototype.B = 6356079.0;
  /** A(1-E2) */
  Geo.Datum.Tokyo.prototype.a = 6334832.106;
  /** 扁平率 */
  Geo.Datum.Tokyo.prototype.F = 1 / 299.152813;

  /**
   * 位置情報
   */
  Geo.Position = function(/* lat, lng, opt */) {
    this.initialize.apply(this, arguments);
  };
  /** radian */
  Geo.Position.RD = Math.PI / 180;
  Geo.Position.prototype = {
    /** 世界測地系を基本とするかどうか */
    type: null,
    /** 世界測地系位置情報 */
    wgs84: null,
    /** 日本測地系位置情報 */
    tokyo: null,
    /**
     * 初期化します。
     * ex) opt: { type: Geo.Datum.Type.wgs84 }
     * @param lat 緯度(number:deg, string:dmsと解釈)
     * @param lng 経度(number:deg, string:dmsと解釈)
     * @param opt オプション
     */
    initialize: function(lat, lng, opt) {
      var xyz, blh;
      if (!opt ||
        opt.type < Geo.Datum.Type.wgs84 || Geo.Datum.Type.tokyo < opt.type) {
        isWgs84 = Geo.Datum.Type.tokyo;
      }
      this.wgs84 = new Geo.Datum.WGS84();
      this.tokyo = new Geo.Datum.Tokyo();
      if (opt.type == Geo.Datum.Type.wgs84) {
        this.wgs84.setLatLng(lat, lng);
        xyz = Geo.Position.blh2xyz(this.wgs84.lat.toDeg(), this.wgs84.lng.toDeg(), 0, this.wgs84.A, this.wgs84.E2);
        blh = Geo.Position.xyz2blh(xyz.x - Geo.Datum.Tokyo.Dx, xyz.y - Geo.Datum.Tokyo.Dy, xyz.z - Geo.Datum.Tokyo.Dz, this.tokyo.A, this.tokyo.E2);
        this.tokyo.setLatLng(blh.b, blh.l);
      } else if (opt.type == Geo.Datum.Type.tokyo) {
        this.tokyo.setLatLng(lat, lng);
        xyz = Geo.Position.blh2xyz(this.tokyo.lat.toDeg(), this.tokyo.lng.toDeg(), 0, this.tokyo.A, this.tokyo.E2);
        blh = Geo.Position.xyz2blh(xyz.x + Geo.Datum.Tokyo.Dx, xyz.y + Geo.Datum.Tokyo.Dy, xyz.z + Geo.Datum.Tokyo.Dz, this.wgs84.A, this.wgs84.E2);
        this.wgs84.setLatLng(blh.b, blh.l);
      } else {
        throw 'error:cannnot initialize Position.';
      }
    }
  };
  /**
   * 楕円体座標 -> 直交座標
   * @param b 緯度(deg)
   * @param l 経度(deg)
   * @param h 楕円体高[m]
   * @param a 長半径
   * @param e2 (第1離心率e)^2
   * @return xyz
   */
  Geo.Position.blh2xyz = function(b, l, h, a, e2) {
    b *= Geo.Position.RD;
    l *= Geo.Position.RD;
    var sb = Math.sin(b),
      cb = Math.cos(b),
      rn = a / Math.sqrt(1 - e2 * Math.pow(sb, 2)),
      x = (rn + h) * cb * Math.cos(l),
      y = (rn + h) * cb * Math.sin(l),
      z = (rn * (1 - e2) + h) * sb;
    return {x: x, y: y, z: z};
  };
  /**
   * 直交座標 -> 楕円体座標
   * @param x x座標
   * @param y y座標
   * @param z z座標
   * @param a 長半径
   * @param e2 (第1離心率e)^2
   * @return blh
   */
  Geo.Position.xyz2blh = function(x, y, z, a, e2) {
    var bda = Math.sqrt(1 - e2),
      p = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
      t = Math.atan2(z, p * bda),
      st = Math.sin(t),
      ct = Math.cos(t),
      b = Math.atan2(z + e2 * a / bda * Math.pow(st, 3), p - e2 * a * Math.pow(ct, 3)),
      l = Math.atan2(y, x),
      sb = Math.sin(b),
      rn = a / Math.sqrt(1 - e2 * Math.pow(sb, 2)),
      h = p / Math.cos(b) - rn,
      blh = { b: b / Geo.Position.RD, l: l / Geo.Position.RD, h: h };
    return blh;
  };
  window.Geo = Geo;
})();