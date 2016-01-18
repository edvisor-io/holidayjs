//this was taken from http://techneilogy.blogspot.ca/2012/02/couple-of-years-ago-i-posted-source.html
module.exports = function(year) {
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4); 
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3); 
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var n0 = (h + l + 7 * m + 114)
  var n = Math.floor(n0 / 31) - 1;
  var p = n0 % 31 + 1;
  var date = new Date(year,n,p);
  return date; 
}