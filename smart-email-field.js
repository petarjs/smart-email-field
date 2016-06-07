(function (window, document, $) {
  'use strict';

  var $el;
  var $wrapper;
  var $shadow;

  var EMAIL_DOMAINS = [
    /* Default domains included */
    'gmail.com', 'att.net', 'comcast.net', 'facebook.com', 'gmail.com', 'gmx.com', 'googlemail.com',
    'google.com', 'hotmail.com', 'hotmail.co.uk', 'mac.com', 'me.com', 'mail.com', 'msn.com',
    'live.com', 'sbcglobal.net', 'verizon.net', 'yahoo.com', 'yahoo.co.uk', 'aol.com',

    /* Other global domains */
    'email.com', 'games.com' /* AOL */, 'gmx.net', 'hush.com', 'hushmail.com', 'icloud.com', 'inbox.com',
    'lavabit.com', 'love.com' /* AOL */, 'outlook.com', 'pobox.com', 'rocketmail.com' /* Yahoo */,
    'safe-mail.net', 'wow.com' /* AOL */, 'ygm.com' /* AOL */, 'ymail.com' /* Yahoo */, 'zoho.com', 'fastmail.fm',
    'yandex.com',

    /* United States ISP domains */
    'bellsouth.net', 'charter.net', 'comcast.net', 'cox.net', 'earthlink.net', 'juno.com',

    /* British ISP domains */
    'btinternet.com', 'virginmedia.com', 'blueyonder.co.uk', 'freeserve.co.uk', 'live.co.uk',
    'ntlworld.com', 'o2.co.uk', 'orange.net', 'sky.com', 'talktalk.co.uk', 'tiscali.co.uk',
    'virgin.net', 'wanadoo.co.uk', 'bt.com',

    /* Domains used in Asia */
    'sina.com', 'qq.com', 'naver.com', 'hanmail.net', 'daum.net', 'nate.com', 'yahoo.co.jp', 'yahoo.co.kr', 'yahoo.co.id', 'yahoo.co.in', 'yahoo.com.sg', 'yahoo.com.ph',

    /* French ISP domains */
    'hotmail.fr', 'live.fr', 'laposte.net', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'gmx.fr', 'sfr.fr', 'neuf.fr', 'free.fr',

    /* German ISP domains */
    'gmx.de', 'hotmail.de', 'live.de', 'online.de', 't-online.de' /* T-Mobile */, 'web.de', 'yahoo.de',

    /* Russian ISP domains */
    'mail.ru', 'rambler.ru', 'yandex.ru', 'ya.ru', 'list.ru',

    /* Belgian ISP domains */
    'hotmail.be', 'live.be', 'skynet.be', 'voo.be', 'tvcablenet.be', 'telenet.be',

    /* Argentinian ISP domains */
    'hotmail.com.ar', 'live.com.ar', 'yahoo.com.ar', 'fibertel.com.ar', 'speedy.com.ar', 'arnet.com.ar',

    /* Domains used in Mexico */
    'hotmail.com', 'yahoo.com.mx', 'live.com.mx', 'yahoo.com', 'hotmail.es', 'live.com', 'hotmail.com.mx', 'prodigy.net.mx', 'msn.com'
  ];

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
    addStyle('.sef-shadow {' + elCss + '}');
    var shadow = $('<div>').addClass('sef-shadow');
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
        text += ' ';
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

  function addStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  window.SmartEmailField = {
    init: init
  };
})(window, document, $);

