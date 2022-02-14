window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelAnimFrame = (function(_id) {
  return window.cancelAnimationFrame ||
    window.cancelRequestAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    function(_id) { window.clearTimeout(id); };
})();
var FirstView = function() {
  this._logo = document.getElementsByClassName('logo')[0];
  this._logo.classList.add('show');
}
var Handling = function() {
  this._section = document.getElementsByClassName('animated');
  this._banner = document.getElementById('banner') || document.getElementById('top_area');
  this._menu = document.getElementById('menu');
  this._flagTop = document.getElementById('banner');
  this._main = document.getElementById('main');
  this._navGlobal = document.getElementById('nav_global');
  this._navItem = document.querySelectorAll('.nav_global a');
  this._scroll = document.querySelector('.scroll');
  this._title;
  this._width;
  this._height = window.innerHeight;
  this._offset;
  this._start = 100;
  this._heightBanner;
  this._layer;
  this.iActive;
  this._linkItem;
  this._flag = true;
  this.init();
  this.checkActive();
}

Handling.prototype = {
  init: function() {
    var _self = this;
    this.setNav = function() {
      _self._heightBanner = _self._banner.clientHeight;
      var _top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      if (_self._heightBanner < _top) {
        _self.setPos('fixed', 0);
      } else {
        setTimeout(function() {
          _self.setPos('absolute', _self._banner.clientHeight);
        }, 50);
      }
    }
    window.addEventListener('load', function() {
      _self._width = window.innerWidth;
      if (_self._width > 768) {
        _self.setNav();
        if (_self._flagTop) {
          $.Velocity.hook(_self._section, 'opacity', '0');
        }
      } else {
        $.Velocity.hook(_self._section, 'opacity', '1');
      }
    }, false);
    window.addEventListener('resize', function() {
      _self.onScroll();
      if (_self._width > 768) { _self.setNav(); }
    }, false);
    window.addEventListener('scroll', function() { _self.onScroll(); }, false);
  },
  onScroll: function() {
    var o = this
    o._width = window.innerWidth;
    var _top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    this.handlScroll = function() {
      o._heightBanner = o._banner.clientHeight;
      if (o._heightBanner < _top) {
        if (!o._navGlobal.classList.contains('active')) {
          o._navGlobal.classList.add('active');
          o.setPos('fixed', 0);
        }
      } else {
        if (o._navGlobal.classList.contains('active')) {
          o._navGlobal.classList.remove('active');
          setTimeout(function() {
            o.setPos('absolute', o._banner.clientHeight);
          }, 50);
        }
      }
      if (o._scroll) {
        if (_top > o._heightBanner - o._start) {
          o._scroll.classList.add('hide');
        } else {
          o._scroll.classList.remove('hide');
        }
      }
      for (var i = 0; i < o._section.length; i++) {
        o._linkItem = o._section[i].querySelectorAll('.link_item');
        o._offset = o._section[i].offsetTop;
        if (o._offset < _top + (o._height - o._start)) { //start animation
          if (!o._section[i].classList.contains('active')) {
            o._section[i].classList.add('active');
            Velocity(o._section[i], { opacity: 1 }, { duration: 450, queue: false, easing: 'linear' });

            for (var z = 0; z < o._linkItem.length; z++) {
              $.Velocity.hook(o._linkItem, 'opacity', '0');
              Velocity(o._linkItem[z], { opacity: 1, scale: [1, 0] }, { duration: 500, delay: z * 100, queue: false, easing: 'linear' });
            }
          }
        } else {
          if (o._section[i].classList.contains('active')) {
            $.Velocity.hook(o._linkItem, 'opacity', '0');
            o._section[i].classList.remove('active');
            Velocity(o._section[i], { opacity: 0 }, { duration: 300, queue: false, easing: 'linear' });
          }
        }
      }
    }

    if (o._width > 768) {
      o._flag = true;
      if (o._flag) {
        o.handlScroll();
      }
    } else {
      o._navGlobal.removeAttribute("style");
      if (o._scroll) {
        o._scroll.classList.remove('hide');
      }
      o._flag = false;
      o._heightBanner = o._banner.clientHeight;
      if (o._heightBanner < _top) {
        o._menu.classList.add('black');
      } else {
        o._menu.classList.remove('black');
      }
    }
  },
  setPos: function(_pos, _top) {
    var s = this;
    s._navGlobal.style.opacity = 1;
    s._navGlobal.style.position = _pos;
    s._navGlobal.style.top = _top + 'px';
  },
  checkActive: function() {
    var c = this;
    c._title = document.querySelector('.top_area h2');
    if (c._title) {
      var txt_Title = c._title.innerHTML.toLowerCase();
      for (var i = 0; i < c._navItem.length; i++) {
        var txt_Nav = c._navItem[i].innerHTML.toLowerCase();
        if (txt_Title == "information") {
          txt_Title = "info";
        }
        if (txt_Nav == txt_Title) {
          c._navItem[i].classList.add('active');
        } else {
          c._navItem[i].classList.remove('active');
        }
      }
    }
  }
}

var Menu = function() {
  var _self = this;
  this._smenu = document.getElementById('menu');
  this._snavGlobal = document.getElementById('nav_global');
  this._snavItem = document.querySelectorAll('.nav_global a');
  this._sbody = document.getElementsByTagName('body')[0];
  this._sscroll = document.querySelector('.scroll');
  this._urlHash = window.location.hash;
  this._target = this._urlHash.slice(1);

  this.onResizeHandler = function() {
    var _width = document.body.clientWidth;
    if (_width > 768) {
      _self.closeMenu();
      if (_self._target) {
        Velocity(document.getElementById('container'), 'scroll', { duration: 0, delay: 0 });
        Velocity(document.getElementById(_self._target), 'scroll', { duration: 1000, delay: 200, offset: -76, easing: 'easeInOutCubic' });
      }
    } else {
      if (_self._target) {
        Velocity(document.getElementById('container'), 'scroll', { duration: 50, delay: 0 });
        Velocity(document.getElementById(_self._target), 'scroll', { duration: 500, offset: 0, delay: 50, easing: 'linear' });
      }
    }
  }
  this.showMenu = function() {
    if (!_self._smenu.classList.contains('active')) {
      _self._smenu.classList.add('active');
      _self._snavGlobal.classList.add('active');
      Velocity(_self._snavGlobal, "slideDown", { duration: 450, easing: 'linear' });
      $.Velocity.hook(_self._snavItem, "opacity", "0");
      for (var i = 0; i < _self._snavItem.length; i++) {
        Velocity(_self._snavItem[i], { opacity: 1 }, { duration: 350, delay: 55 * i, easing: 'linear' });
      }
      _self._sbody.style.overflow = "hidden";
    } else {
      Velocity(_self._snavGlobal, "slideUp", { duration: 350, easing: 'linear' });
      $.Velocity.hook(_self._snavItem, "opacity", "0");
      _self._snavGlobal.classList.remove('active');
      _self._smenu.classList.remove('active')
      _self._sbody.removeAttribute("style");
    }
  }
  this.closeMenu = function() {
    _self._smenu.classList.remove('active');
    _self._snavGlobal.classList.remove('active');
    _self._snavGlobal.style.display = '';
    for (var i = 0; i < _self._snavItem.length; i++) {
      _self._snavItem[i].removeAttribute("style");
    }
    _self._sbody.removeAttribute("style");

  }
  this.onResizeHandler();
  window.addEventListener('resize', this.onResizeHandler, false);
  this._smenu.addEventListener('click', this.showMenu, false);
  if (this._sscroll) {
    this._sscroll.addEventListener('click', this.closeMenu, false);
  }
  if (!this._smenu) return;
}

var Tab = function() {
  var _self = this;
  this.itemLink = document.getElementsByClassName("tab_link");
  this.item = document.getElementsByClassName("tab_item");
  this.tab_news = document.getElementById("tab_news");
  this._target = window.location.hash;
  if (!this.item.length) return;
  this.init();

  // reset
  for (var j = 0; j < _self.item.length; j++) {
    _self.item[j].classList.remove("active");
    _self.itemLink[j].classList.remove("active");
    _self.item[j].style.display = "none";
  }
  this.reset = function(pos) {
    _self.item[pos].style.display = "block";
    _self.item[pos].classList.add("active");
    _self.itemLink[pos].classList.add("active");
  }

  if (_self.tab_news) {
    var top = _self.item.length - 1;
    _self.reset(top);
  } else {
    if (this._target == "#item3") {
      var top = 2;
    } else if (this._target == "#item2") {
      var top = 1;
    } else {
      var top = 0;
    }
    _self.reset(top);
  }
  this.handling = function(list, tab_item, taget, pos) {
    for (var j = 0; j < list.length; j++) {
      list[j].style.display = "none";
      list[j].classList.remove("active");
      tab_item[j].classList.remove("active");
    }
    list[pos].style.display = "block";
    list[pos].classList.add("active");
    taget.classList.add("active");
  }
}

Tab.prototype = {
  init: function(e) {
    var r = this;
    for (var i = 0; i < r.itemLink.length; i++) {
      r.itemLink[i].addEventListener("click", function(e) {
        var index = Array.prototype.indexOf.call(r.itemLink, e.currentTarget);
        r.handling(r.item, r.itemLink, e.currentTarget, index);
      });
    }
  }
}
var AnchorLink = function() {
  this._targets = document.querySelectorAll('a[href^="#"]');
  if (!this._targets.length) return;
  this.init();
}
AnchorLink.prototype = {
  init: function() {
    var i = 0 | 0;
    for (i = 0; i < this._targets.length; i = (i + 1) | 0) {
      this._targets[i].addEventListener('click', this.onClickHD, false);
    };
  },
  onClickHD: function(e) {
    var _hash = e.currentTarget.getAttribute('href').replace('#', '');
    Velocity(document.getElementById(_hash), 'scroll', { duration: 1000, delay: 0, easing: 'easeInOutSine' });
    e.preventDefault();
  }
}

var Slide = function() {
  var _self = this;
  this._slide = document.getElementById('slide_content');
  if (!this._slide) return;
  this._list = this._slide.getElementsByTagName('li');
  this._navbanner = document.querySelector('.nav_banner ul');
  this.img_h = document.querySelector('.img_item');
  this._current = 0;
  this._prev = 0;
  this._timer;
  this._count = 0;
  this._len = this._list.length;
  for (var j = 0; j < _self._list.length; j++) {
    this._list_item = document.createElement('li');
    _self._navbanner.appendChild(_self._list_item);
  }
  this._list_nav = document.querySelectorAll('.nav_banner li');
  this.setHeight = function() {
    _self._slide.style.height = _self.img_h.clientHeight + "px";
  }
  this.init();
}
Slide.prototype = {
  init: function() {
    var _self = this;
    window.addEventListener('load', this.setHeight, false);
    window.addEventListener('resize', this.setHeight, false);
    _self.Start();
  },
  Start: function() {
    var s = this;
    for (var i = 0; i < s._list_nav.length; i++) {
      s._list_nav[i].addEventListener("click", function(e) {
        var _countnav = Array.prototype.indexOf.call(s._list_nav, e.currentTarget);
        if (!s._list_nav[_countnav].classList.contains("active")) {
          s._prev = s._current;
          clearTimeout(s._timer);
          s._current = _countnav;
          s.nextSlider();
        }
      });
    }
    if (s._count == 0) {
      s._list[s._current].classList.add("current")
      s._list_nav[s._current].classList.add("active");
    }
    s._timer = setTimeout(function() { s.getCurrent() }, 5000);
  },
  getCurrent: function() {
    var h = this;
    h._prev = h._current;
    h._current++;
    if (h._current >= h._list.length) {
      h._current = 0;
    }
    h.nextSlider();
  },
  nextSlider: function() {
    var a = this;
    for (var i = 0; i < a._list.length; i++) {
      a._list[i].classList.remove("prev");
      a._list_nav[i].classList.remove("active");
    }
    a._list_nav[a._current].classList.add("active");
    a._list_nav[a._prev].classList.remove("active");
    a._list[a._current].classList.add("current");
    a._list[a._prev].classList.remove("current");
    a._list[a._prev].classList.add("prev");
    $.Velocity.hook(a._list[a._current], "opacity", "0");
    $.Velocity.hook(a._list[a._current], "scale", "1");
    Velocity(a._list[a._current], { opacity: 1 }, { duration: 900, delay: 0, queue: false, easing: 'linear' });
    a._timer = setTimeout(function() { a.getCurrent() }, 5000);
  }
}

var ActiveLink = function() {
  this._navgl = document.getElementById('nav_global');
  this._navglItem = this._navgl.getElementsByTagName('a');
  this._targetUrl = window.location.pathname;
  this._mainContent = document.getElementById('banner');
  if (!this._navgl) return;
  this.init();
}
ActiveLink.prototype = {
  init: function() {
    for (var i = 0; i < this._navglItem.length; i++) {
      var _href = this._navglItem[i].getAttribute('href').replace('/', ''),
        patt = new RegExp(_href);
      patt.test(this._targetUrl) ? this._navglItem[i].classList.add('active') : '';
      !this._mainContent ? this._navglItem[0].classList.remove('active') : '';
    }
  }
}

var EarthConnect = function() {
  var _canvas = document.getElementById('canvas'),
    _domBox = document.getElementById('box'),
    _renderer,
    _renderingTimer,
    _stage,
    _earth,
    _blurFilter,
    _count = 0,
    _guideImg,
    _guideArr = [],
    _dotArr = [],
    itemblur = [],
    maskArr = [],
    dot,
    dotBlur,
    flag = true,
    delay = 0,
    index = 0,
    fadespeed1 = 0.5,
    fadespeed2 = 0.5,
    flagDot = true,
    ptIndex = 0,
    line,
    flagPc = true,
    flagAnimate = true,
    listEle = [ // [ name, p0, p2, guideXY, distance, radius, width, ArrayPoint, ArrayDot, color Dot]
      ['ele 1', p0 = { x: 921, y: 373 }, p2 = { x: 467, y: 432 }, p3 = { x: 395, y: 66 }, 249, 0.52, 360, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 2', p0 = { x: 918, y: 374 }, p2 = { x: 1004, y: 234 }, p3 = { x: 395, y: 66 }, 149, 0.87, 95, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 3', p0 = { x: 921, y: 374 }, p2 = { x: 845, y: 412 }, p3 = { x: 395, y: 66 }, 80, 0.67, 82, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 4', p0 = { x: 921, y: 370 }, p2 = { x: 576, y: 425 }, p3 = { x: 395, y: 66 }, 130, 0.40, 215, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 5', p0 = { x: 919, y: 374 }, p2 = { x: 995, y: 299 }, p3 = { x: 395, y: 66 }, 68, 0.9, 70, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 6', p0 = { x: 921, y: 369 }, p2 = { x: 702, y: 420 }, p3 = { x: 395, y: 66 }, 100, 0.89, 90, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 7', p0 = { x: 923, y: 376 }, p2 = { x: 650, y: 395 }, p3 = { x: 395, y: 66 }, 273, 0.34, 131, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 8', p0 = { x: 918, y: 374 }, p2 = { x: 1118, y: 115 }, p3 = { x: 395, y: 66 }, 202.5, 0.98, 200, [],
        [], 0, size = { width: 754, height: 530 }
      ],
      ['ele 9', p0 = { x: 406, y: 612 }, p2 = { x: 806, y: 193 }, p3 = { x: 164, y: 152 }, 143, 0.7, 347, [],
        [], 1, size = { width: 829, height: 568 }
      ],
      ['ele 10', p0 = { x: 406, y: 612 }, p2 = { x: 771, y: 362 }, p3 = { x: 164, y: 152 }, 160, 0.79, 167, [],
        [], 1, size = { width: 829, height: 568 }
      ],
      ['ele 11', p0 = { x: 406, y: 612 }, p2 = { x: 339, y: 716 }, p3 = { x: 164, y: 152 }, 33, 0.35, 62, [],
        [], 1, size = { width: 829, height: 568 }
      ],
      ['ele 12', p0 = { x: 406, y: 612 }, p2 = { x: 183, y: 716 }, p3 = { x: 164, y: 152 }, 93, 0.72, 92, [],
        [], 1, size = { width: 829, height: 568 }
      ],
    ];
  var Main = function() {
    _renderer = PIXI.autoDetectRenderer(1664, 1422, { autoResize: true, transparent: !0 });
    _canvas.appendChild(_renderer.view);
    _stage = new PIXI.Container();
    _blurFilter = new PIXI.filters.BlurFilter();
    _blurFilterEle = new PIXI.filters.BlurFilter();
    _earth = PIXI.Sprite.fromImage("./images/earth.png");
    _guideImg = PIXI.Sprite.fromImage("./images/guide/guide_img.png");
    _guideImg.x = 172;
    _guideImg.y = 0;
    _guideImg.alpha = 0;
    _stage.addChild(_earth);
   // _stage.addChild(_guideImg);

    //create two first dot
    dot = new PIXI.Graphics();
    dotBlur = new PIXI.Graphics();

    dot.beginFill(0xffffff, 1);
    dot.drawCircle(920, 374, 5);
    dot.endFill();
    dot.beginFill(0xfafdbc, 1);
    dot.drawCircle(408, 612, 3);
    dot.endFill();
    dot.alpha = 0;

    dotBlur.beginFill(0xffffff, 1);
    dotBlur.drawCircle(920, 374, 8);
    dotBlur.endFill();
    dotBlur.beginFill(0xffffff, 1);
    dotBlur.drawCircle(408, 612, 6);
    dotBlur.endFill();
    dotBlur.alpha = 0;
    dotBlur.filters = [_blurFilter];
    _blurFilter.blur = 5;

    // create line guide
    line = new PIXI.Graphics();
    line.lineStyle(1, 0xffffff, 1);
    _stage.addChild(line);

    _stage.addChild(dot);
    _stage.addChild(dotBlur);
    // guidedraw(p0, p2, _dis, _radi, ArrPoint, ArrDot);
    for (var i = 0; i < listEle.length; i++) {
      var item = listEle[i],
        guide1 = item[1].x,
        guide2 = item[2].x;
      var guide = PIXI.Sprite.fromImage('./images/guide/w' + (i + 1) + '.png');
      var color = 0xffffff;
      item[9] == 0 ? color = 0xffffff : color = 0xfffd71;
      guide.anchor.set(0);

      guide.x = item[3].x;
      guide.y = item[3].y;

      guide.width = item[10].width;
      guide.height = item[10].height;

      mask = new PIXI.Graphics();
      mask.beginFill(0x000000, 1);
      mask.drawRect(0, 0, item[10].width, item[10].height);
      guide2 < guide1 ? mask.x = guide2 + item[10].width : mask.x = -(guide.width - guide.x);
      mask.y = guide.y;
      mask.endFill();
      guide.mask = mask;

      maskArr.push(mask);
      _guideArr.push(guide);
      _stage.addChild(guide);
      //_stage.addChild(mask);
      guidedraw(item[1], item[2], item[4], item[5], item[7], _dotArr, color);
    }

    window.addEventListener('resize', onResizeHD, false);
    onResizeHD();
    _renderingTimer = window.requestAnimFrame(rendering);
  }

  function guidedraw(_p0, _p2, _distance, _radius, _ArrPoint, _ArrDot, _color) {
    var _dot = new PIXI.Graphics(),
      _blur = new PIXI.Graphics(),
      lastX = _p0.x,
      lastY = _p0.y;
    _p0.x < _p2.x ? _distance = _distance : _distance = -_distance; // inverts cuver
    // p1 is Point Control
    p1 = getpointControl(_p0, _p2, _distance, _radius);
    _dot.beginFill(_color, 1);
    _dot.drawCircle(0, 0, 6);
    _dot.endFill();
    _blur.beginFill(0xffffff, 0.5);
    _blur.drawCircle(922, 376, 15);
    _blur.endFill();

    var dotElement = _dot.generateCanvasTexture(),
      dotElementBlur = _blur.generateCanvasTexture(),
      dotElementBMP = new PIXI.Sprite(dotElement),
      dotElementBlurBMP = new PIXI.Sprite(dotElementBlur);
    dotElementBMP.anchor.set(0.5);
    dotElementBMP.alpha = 0;
    dotElementBlurBMP.anchor.set(0.5);
    dotElementBlurBMP.alpha = 0;
    dotElementBlurBMP.direction = Math.random() * Math.PI * 2;
    dotElementBlurBMP.turningSpeed = Math.random() - 0.8;
    dotElementBlurBMP.filters = [_blurFilterEle];
    _blurFilterEle.blur = 6;

    _dotArr.push(dotElementBMP);
    _stage.addChild(dotElementBMP);
    dotElementBlurBMP.alpha = 0;
    itemblur.push(dotElementBlurBMP);
    _stage.addChild(dotElementBlurBMP);

    // return XY of Distance point in T time
    pointMain(_p0, p1, _p2, _ArrPoint)

  }
  // get XY of Control Point with distance
  function getpointControl(p0, p2, distance, _radius) {
    var dx = p2.x - p0.x;
    var dy = p2.y - p0.y;
    var midpoint = { x: p0.x + dx * _radius, y: p0.y + dy * _radius, };
    var angle = Math.atan2(dy, dx);
    var perpendicularPoint = {
      x: midpoint.x + distance * Math.cos(angle - Math.PI / 2),
      y: midpoint.y + distance * Math.sin(angle - Math.PI / 2)
    };
    return (perpendicularPoint);
  }
  // get XY of Destination Point and push to Arr
  function pointMain(p0, p1, p2, _arr) {
    var lastX = p0.x;
    var lastY = p0.y;
    for (var T = 0; T < 500; T++) {
      var p = getBezierXYatT(p0, p1, p2, T / 500);
      var dx = p.x - lastX;
      var dy = p.y - lastY;
      if (dx * dx + dy * dy > 1) {
        _arr.push({ x: p.x, y: p.y });
        lastX = p.x;
        lastY = p.y;
      }
    }
    return (_arr)
  }
  // Handling Destination Point
  function getBezierXYatT(startPt, controlPt, endPt, T) {
    var x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;
    var y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T, 2) * endPt.y;
    return ({ x: x, y: y });
  }

  var onResizeHD = function() {
    var _width = document.body.clientWidth;
    if (_width > 768) {
      if (flagPc) {
        for (var z = 0; z < _guideArr.length; z++) {
          _guideArr[z].alpha = 1;
        }
        if (flagAnimate) {
          TweenLite.to(maskArr[0], 3, { x: _guideArr[0].x, delay: 0.5, ease: Power2.easeInOut });
          setTimeout(function() {
            for (var i = 0; i < listEle.length; i++) {
              i > 0 ? TweenLite.to(maskArr[i], 5, { x: _guideArr[i].x, delay: 0.5, ease: Power2.easeInOut }) : '';
            }
          }, 350);
          flagAnimate = false;
        }

        setTimeout(function() { _domBox.classList.add('active') }, 4500);
        flagPc = false;
      }
    } else {
      for (var j = 0; j < listEle.length; j++) {
        var item = listEle[j],
          guide = _guideArr[j],
          guide1 = item[1].x,
          guide2 = item[2].x;
        guide2 < guide1 ? maskArr[j].x = guide2 + item[10].width : maskArr[j].x = -(guide.width - guide.x);
        maskArr[j].y = guide.y;
      }
      for (var i = 0; i < _guideArr.length; i++) {
        _guideArr[i].alpha = 0;
        _dotArr[i].alpha = 0;
        itemblur[i].alpha = 0;
        _domBox.classList.remove('active');

      }
      flagPc = true;
      flagAnimate = true;
    }
  }

  // Handl content
  var updateDot = function(time) {
    if (index < listEle.length - 1) { // increment index 
      index++;
    } else {
      index = listEle.length - 1;
    }
    if (index >= listEle.length - 1) {
      ptIndex++;
      // start animate
      for (var j = 0; j < _dotArr.length; j++) {
        var item = itemblur[j];
        item.alpha = fadespeed1;
        _dotArr[j].alpha += .01;
      }
    };
    // fadeIn, fadeOut for dot Ele
    if (fadespeed1 <= 1 && flag) {
      fadespeed1 += .05;
    } else {
      flag = false;
      !flag && fadespeed1 >= 0.2 ? fadespeed1 -= .025 : flag = true;
    }
    // animate Dot Ele vs Dot Blur
    for (var i = 0; i < listEle.length; i++) {
      var dom = listEle[i];
      if (ptIndex < dom[7].length && ptIndex < dom[6]) {
        var p = dom[7][ptIndex];

        //line.drawCircle(p.x, p.y, 0.1); // line guide
        _dotArr[i].x = p.x;
        _dotArr[i].y = p.y;
        itemblur[i].x = p.x;
        itemblur[i].y = p.y;
      }

    }
  }
  var reset = function() {
    var _width = document.body.clientWidth;
    if (_width < 768) {
      delay = 0;
      index = 0;
      ptIndex = 0;
      _count = 0;
      dot.alpha = 0;
      dotBlur.alpha = 0;

      // if (_guideImg.alpha <= 1) {
      //   _guideImg.alpha += .075;
      // }
      for (var i = 0; i < _guideArr.length; i++) {
        _dotArr[i].alpha = 0;
        itemblur[i].alpha = 0;
      }
    } else {
      if (fadespeed2 <= 1 && flagDot) { // fadeIn, fadeOut for two first dot
        fadespeed2 += .02;
      } else {
        flagDot = false;
        !flagDot && fadespeed2 >= 0.5 ? fadespeed2 -= .025 : flagDot = true;
      }
      // if (_guideImg.alpha > 0) { // hide guide img
      //   _guideImg.alpha -= .1;
      // }
      if (dot.alpha <= 1) { //show first Dot
        dot.alpha += .075;
      }
      dotBlur.alpha = fadespeed2; // effect for two first dot
      if (_count < 250) { // delay before start animate of Dot
        _count++
      } else {
        updateDot();
      }

    }
  }
  var rendering = function() {
    reset();
    _renderer.render(_stage);
    _renderingTimer = window.requestAnimFrame(rendering);
  }
  if (_canvas) { Main() }
}

var Base = function() {
  ! function Base() {
    new FirstView();
    new Handling();
    new AnchorLink();
    new Tab();
    new Slide();
    new Menu();
    new ActiveLink();
    new EarthConnect();
  }();
  return Base;
};

window.addEventListener('DOMContentLoaded', function() {
  if (window.jQuery) window.Velocity = window.jQuery.fn.velocity;
  new Base();
});