/* eslint-disable */
import {HTML} from './global';

(function() {
  const activeClass = 'resize-active';
  const resetDelay = 500;
  let flag = false;
  let timer = null;
  const removeClassHandler = function() {
    flag = false;
    HTML.classList.remove(activeClass);
  };
  const resizeHandler = function() {
    if (!flag) {
      flag = true;
      HTML.classList.add(activeClass);
    }
    clearTimeout(timer);
    const timer = setTimeout(removeClassHandler, resetDelay);
  }
  window.addEventListener('resize', resizeHandler);
})(window);
