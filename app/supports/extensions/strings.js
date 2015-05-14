export default function(/* container, app */) {
  var b, l = "", n;

  String.cssWidthData = {};
  var d = String.cssWidthData;
  var f = function f() {
    if (!n.parentNode) {
      document.body.appendChild(n);
    }
  };

  String.guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };

  String.removeWidthContainer = function () {
    if (n.parentNode) {
      document.body.removeChild(n);
    }
  };

  String.prototype.calculatedWidth = function m(p) {
    if (p === undefined) {
      p = "";
    }
    if (p !== l) {
      l = p;
      b.style.cssText = p || "";
    }
    f();
    b.innerHTML = (function () {
      return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }).apply(this);
    return b.offsetWidth;
  };

  String.prototype.cachedWidth = function h(s, q) {
    var t = s || "nocss";
    if (!q) {
      q = d[t];
    }
    if (!q) {
      d[t] = q = {};
    }
    var o = q[this];
    if (o !== undefined) {
      return o;
    }
    var p;
    q[this] = p = this.calculatedWidth(s, q);
    return p;
  };

  String.prototype.truncateMiddle = function j(p, o) {
    if (p >= this.length) {
      return this;
    }
    if (o === undefined) {
      o = "…";
    }
    var q = Math.floor(p) / 2;
    return this.substring(0, q) + o + this.substring(this.length - (p - q));
  };

  String.prototype.truncateEnd = function k(p, o) {
    if (p >= this.length) {
      return this;
    }
    if (o === undefined) {
      o = "…";
    }
    return this.substring(0, (p - o.length)) + o;
  };

  String.prototype.truncateStart = function k(p, o) {
    if (p >= this.length) {
      return this;
    }
    if (o === undefined) {
      o = "…";
    }
    return this.substring(o + (p - o.length), p);
  };

  String.prototype.truncateToWidth = function g(B, p, s, C) {
    var w = 0;
    var z, v, D, y, t,
      x = 0,
      q, o, u;

    if (!(C instanceof Function)) {
      C = String.prototype.truncateEnd;
    }
    q = B / "i".cachedWidth(s);
    x = B / "W".cachedWidth(s);
    o = this.calculatedWidth(s);
    D = z = this;
    u = o < B;
    while (!u) {
      w++;
      if ((x === y && q === t) || o === B) {
        u = true;
        continue;
      }
      y = x;
      t = q;
      v = Math.floor((x + q) / 2);
      D = C.call(z, v, p);
      o = D.calculatedWidth(s);
      if (o < B) {
        x = v;
      } else {
        q = v;
      }
    }
    return D;
  };
}
