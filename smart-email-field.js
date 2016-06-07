(function (window, document, $) {
  'use strict';

  var $el;
  var $wrapper;
  var $shadow;

  var EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'ymail.com', 'outlook.com'];

  function init(selector) {
    $el = $(selector);
    if(!$el.length) throw Error('No elements match the selector');

    $el.wrap(getWrapper());

    $wrapper = $('.sef-wrapper');

    $wrapper.prepend(getShadowField($el));
    $shadow = $('.sef-shadow');

    $el.keydown(updateShadowText)

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

  function isAlphanumeric(e) {
    return e.which <= 90 && e.which >= 48;
  }

  function isSpecialKey(e) {
    return (e.which >= 8 && e.which <= 48) || (e.which >= 91 && e.which <= 145);
  }

  function isSpace(e) {
    return e.which === 32;
  }

  function isBackspace(e) {
    return e.which === 8;
  }

  function isDelete(e) {
    return e.which === 46;
  }

  function isArrowRight(e) {
    return e.which === 39;
  }

  function updateShadowText(ev) {
    if(isSpecialKey(ev) && !isDelete(ev) && !isBackspace(ev) && !isSpace(ev) && !isArrowRight(ev)) {
      return;
    }

    // handle firefox bugs

    setTimeout(function() {
      var text = ev.target.value;

      if(isSpace(ev)) {
        text += ' '
      }

      if(isArrowRight(ev)) {
        $el.val($shadow.text());
        return;
      }

      var textToAdd = '';
      var atIndex = text.indexOf('@');
      if(atIndex !== -1) {
        var afterAt = text.substring(atIndex + 1);

        var foundDomain = '';
        for (var i = EMAIL_DOMAINS.length - 1; i >= 0; i--) {
          if(EMAIL_DOMAINS[i].indexOf(afterAt) === 0) {
            foundDomain = EMAIL_DOMAINS[i];
          }
        }

        if(foundDomain) {
          textToAdd = foundDomain.substring(afterAt.length);
        }

        $shadow.text(text + textToAdd);
      } else {
        $shadow.text('');
      }

    }, 0)

  }

  window.SmartEmailField = {
    init: init
  };
})(window, document, $);