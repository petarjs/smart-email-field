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

  function updateShadowText(ev) {
    // filter out non alpha num keys
    // tab completion, right arrow completion, enter completion ? Maybe just right arrow
    // handle delete

    setTimeout(function() {
      var text = $el.val();
      var textToAdd = '';

      var atIndex = text.indexOf('@');
      if(atIndex !== -1) {
        var afterAt = text.substring(atIndex + 1);
        console.log(afterAt)

        var foundDomain = '';
        for (var i = EMAIL_DOMAINS.length - 1; i >= 0; i--) {
          if(EMAIL_DOMAINS[i].indexOf(afterAt) === 0) {
            foundDomain = EMAIL_DOMAINS[i];
          }
        }
        console.log(foundDomain)
        if(foundDomain) {
          textToAdd = foundDomain.substring(afterAt.length);
        }

        $shadow.text(text + textToAdd);
      }

    }, 0)

  }

  window.SmartEmailField = {
    init: init
  };
})(window, document, $);