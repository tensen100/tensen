/**
 * 绑定事件
 */
(function () {
  if (document.addEventListener){
    window.addEvent = function(elem, type, fn) {
      elem.addEventListener(type,fn, false);
      return fn;
    } ;
    window.removeEvent = function(elem, type, fn) {
      elem.removeEventListener(type,fn, false)
    } ;
  }
  else if (document.attachEvent) {
    window.addEvent = function(elem, type, fn) {
      const bound = function () {
        return fn.apply(elem, arguments)
      };
      elem.attachEvent('on' + type, bound());
      return bound;
    };
    window.removeEvent = function(elem, type, fn) {
      elem.removeEventListener( 'on' + type, fn)
    };
  }
})();



