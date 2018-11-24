(function() {
  var isReady = false, contentLoadedHandler;

  function ready() {
    if (!isReady) {
      triggerEvent(document, 'ready');
      isReady = true;
    }
  }

  if (document.readyState === 'complete') {
    ready();
  }

  if (document.addEventListener) {
    contentLoadedHandler = function () {
      document.removeEventListener('DOMContentLoaded', contentLoadedHandler, false);
      ready()
    };
    document.addEventListener('DOMContentLoaded', contentLoadedHandler, false);
  } else if (document.attachEvent) {
    contentLoadedHandler = function () {
      if (document.readyState === 'complete') {
        document.detachEvent('onreadystatechange',contentLoadedHandler);
        ready();
      }
      document.attachEvent('onreadystatechange',contentLoadedHandler);
      var toplevel = false;
      try {
        toplevel = window.frameElement === null;
      } catch (e) {
        setTimeout(doScrollCheck,1);
        return;
      }
      ready();
    }
  }
  
  function doScrollCheck() {
    if (isReady) { return }
    try {
      document.documentElement.doScroll('left');
    } catch (e) {
      setTimeout(doScrollCheck, 1);
      return
    }
    ready();
  }
})();

addEvent(document,'ready', function () {
  console.log('ready')
})
