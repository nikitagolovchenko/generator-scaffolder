/* eslint-disable */
(function() {
  function vh() {document.documentElement.style.setProperty('--full-viewport', `${window.innerHeight}px`)}
  vh();
  window.addEventListener('resize', vh);
})(window, document);
