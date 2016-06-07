(function (window, document, $) {
  'use strict';

  var $el;
  var $wrapper;
  var $shadow;

  function init(selector) {
    $el = $(selector);
    if(!$el.length) throw Error('No elements match the selector');

    $el.wrap(getWrapper());

    $wrapper = $('.sef-wrapper');

    $wrapper.prepend(getShadowField($el));
    $shadow = $('.sef-shadow');

    $el.keyup(updateShadowText)

  }

  function getWrapper() {
    return $('<div>').addClass('sef-wrapper');
  }

  function getShadowField(el) {
    var elCss = window.getComputedStyle(el.get(0), '').cssText;
    var shadow = $('<div>').addClass('sef-shadow');
    shadow[0].style.cssText = elCss;
    return shadow;
  }

  function updateShadowText(ev) {
    var text = $el.val();

    if(text.indexOf('@') !== -1) {
      $shadow.text(text + 'gmail.com');
    }

  }

  window.SmartEmailField = {
    init: init
  };
})(window, document, $);