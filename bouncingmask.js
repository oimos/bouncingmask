var MAX = 20; // Number of Edges
var CENTER_POS = {x:100, y:100};
var RADIUS = 50;
var FPS = 60; // only for < IE9
var BOUNCINGSPEED = 5;

var Point = function(centerPos, radius, degree, range, targetEl){
  this.pointX = undefined;
  this.pointY = undefined;
  this.centerX = undefined;
  this.centerY = undefined;
  this.radian = undefined;
  this.image = undefined;
  this.rotation = 0;
  this.radius = radius;
  this.centerPos = centerPos;
  this.degree = degree;
  this.range = range;
  this.target = targetEl;
  this.getElements();
  this.setPoints();
}

Point.prototype = {
  getElements: function(){
    this.radian = this.degree * (Math.PI / 180);
    this.centerX = this.target.getAttribute('width') * 0.5;
    this.centerY = this.target.getAttribute('height') * 0.5;
    this.speed = Math.random() * 10 + BOUNCINGSPEED ;
    this.rotation = 0;
    this.addPos = 0;
  },
  setPoints: function(){
    this.addPos = Math.cos(this.rotation * ( Math.PI / 180) ) * this.range;
    this.radius += this.addPos;
    this.pointX = Math.cos(this.radian) * this.radius + this.centerX;
    this.pointY = Math.sin(this.radian) * this.radius + this.centerY;
    this.rotation += this.speed;
    this.rotation = (this.rotation > 360) ? this.rotation - 360 : this.rotation;
  }
}

var AnimatePoints = function(targetNode, elOrder){
  this.el = targetNode;
  this.elOrder = elOrder;
  this.getElements();
  this.init();
  this.events();
}

AnimatePoints.prototype = {
  getElements: function(){
    this.ctx = this.el.getContext('2d');
    this.ctxDiameter = this.el.width;
    this.ctxRadius = this.ctxDiameter * 0.5;
    this.intensity = this.el.getAttribute('data-intensity') || 0.3;
    this.src = this.el.getAttribute('data-src');
    this.isRandom = this.el.getAttribute('data-random');
    this.link = this.el.getAttribute('data-url');
    this.point = [];
    this.rota = 360 / MAX;
    this.isAnimate = true;
    this.loop = undefined;
    this.image = new Image();
    if(this.isRandom == 'true'){
      this.image.src = imgArray[imgPos];
      imgPos++;
    } else {
      this.image.src = this.src;
    }
  },
  init: function(){
    var that = this;
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / FPS) };

    for(var i = 0; i < MAX; i++){
      this.point[i] = new Point(CENTER_POS, this.ctxRadius, this.rota * i, this.intensity, this.el);
    }

    that.loop = function(){
        if(that.isAnimate){
          that.update();
          requestAnimationFrame(that.loop);
        }
      }
    that.loop();

  },
  update: function() {
    var that = this;
    for(var i = 0; i < MAX; i++){
      that.point[i].setPoints();
    }
    that.draw();
  },
  draw: function() {
    var that = this;

    //Clear the frame
    that.ctx.clearRect(0, 0, that.el.width, that.el.height);

    //Load a masking image
    that.ctx.drawImage(that.image, 0, 0, that.ctxDiameter, that.ctxDiameter)

    //Adjust masking
    that.ctx.globalCompositeOperation = 'destination-atop';

    //Draw a circle with bezier curve
    that.ctx.beginPath();
    var xcFirst = (that.point[0].pointX + that.point[MAX - 1].pointX) / 2;
    var ycFirst = (that.point[0].pointY + that.point[MAX - 1].pointY) / 2;

    that.ctx.moveTo(xcFirst, ycFirst);
    for(var j = 0; j < MAX - 1; j++){
      var xc = (that.point[j].pointX + that.point[j + 1].pointX) / 2;
      var yc = (that.point[j].pointY + that.point[j + 1].pointY) / 2;
      that.ctx.quadraticCurveTo(that.point[j].pointX, that.point[j].pointY, xc, yc);
    }
    that.ctx.quadraticCurveTo(that.point[j].pointX, that.point[j].pointY, xcFirst, ycFirst);
    that.ctx.closePath();
    that.ctx.fill('evenodd');
  },
  events: function(e){
    this.el.addEventListener('click', this.pageTransition.bind(this), false);
    this.el.addEventListener('mouseover', this.pauseBounce.bind(e, this), false);
    this.el.addEventListener('mouseout', this.resumeBounce.bind(e, this), false);
  },
  pageTransition: function(){
    window.location = this.link;
  },
  pauseBounce: function(e){
    var that = e;
    that.isAnimate = false;
  },
  resumeBounce: function(e){
    var that = e;
    that.isAnimate = true;
    that.loop();
  }
}


var targetNode = document.querySelectorAll('canvas');
var randomImgEl = document.querySelectorAll('canvas[data-random="true"]');
var imgArray = [];
var imgPos = 0;
randomImgEl.forEach(function(el){
  imgArray.push(el.getAttribute('data-src'));
});
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
imgArray = shuffle(imgArray);

for(var i = 0; i < targetNode.length; i++){
  var animatePoints = new AnimatePoints(targetNode[i], i);
}