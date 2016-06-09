/**
 *
 * Smart Email Field v0.0.1
 * Description, by Petar Slovic.
 * http://gomakethings.com
 *
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 *
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(factory);
    } else if ( typeof exports === 'object' ) {
        module.exports = factory;
    } else {
        root.SmartEmailField = factory(root); // @todo Update to plugin name
    }
})(this, function (root) {

    'use strict';

    //
    // Variables
    //

    var exports = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test

    var el;
    var wrapper;
    var shadow;

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

    // Default settings
    var defaults = {
        emailDomains: EMAIL_DOMAINS,
        callbackBefore: function () {},
        callbackAfter: function () {}
    };


    //
    // Methods
    //

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    function extend( defaults, options ) {
        for ( var key in options ) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                defaults[key] = options[key];
            }
        }
        return defaults;
    };

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    function forEach(collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Remove whitespace from a string
     * @private
     * @param {String} string
     * @returns {String}
     */
    function trim( string ) {
        return string.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Cross Browser add event to DOM Node
     * @private
     * @param {DOMNode} element
     * @param {String} evnt
     * @param {Funciton} funct
     * @returns {undefined}
     */
    function addEvent(element, evnt, funct){
      if (element.attachEvent)
       return element.attachEvent('on' + evnt, funct);
      else
       return element.addEventListener(evnt, funct, false);
    }

    /**
     * Wrap element with a div that has a specified class
     * @private
     * @param {DOMNode} el
     * @param {String} wrapperClass
     * @returns {DOMNode}
     */
    function wrap(el, wrapperClass) {
      var oldHtml = el.outerHTML;
      var newHtml = '<div class="' + wrapperClass + '">' + oldHtml + '</div>';
      el.outerHTML = newHtml;
      return el;
    }

    /**
     * Add an element before another
     * @private
     * @param {DOMNode} parent
     * @param {DOMNode} el
     * @returns {undefined}
     */
    function prepend(parent, el) {
      parent.insertBefore(el, parent.firstChild);
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

    /**
     * Add a <style> tag with specified css rules
     * @private
     * @param {String} css
     * @returns {undefined}
     */
    function addStyle(css) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');

      style.type = 'text/css';
      
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
    }

    /**
     * Get css of an element as a string
     * @private
     * @param {DOMNode} el
     * @returns {String}
     */
    function getElementCss(el) {
      return window.getComputedStyle(el, '').cssText;
    }

    function getShadowField(el) {
      var elCss = getElementCss(el);
      addStyle('.sef-shadow {' + elCss + '}');
      el.style.background = 'transparent';
      
      var shadow = document.createElement('div');
      shadow.className = 'sef-shadow';
      return shadow;
    }

    /**
     * Updates shadow element's text to suggest email domains
     * @private
     * @param {DomEvent} ev
     * @returns {undefined}
     */
    function updateShadowText(ev) {
      if(isSpecialKey(ev) && !isDelete(ev) && !isBackspace(ev) && !isSpace(ev) && !isArrowRight(ev)) {
        return;
      }

      // handle firefox bugs
      // handle multiple fields

      setTimeout(function() {
        var text = ev.target.value;

        if(isSpace(ev)) {
          text += ' ';
        }

        if(isArrowRight(ev)) {
          el.value = shadow.innerText || shadow.textContent;
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

          shadow.innerText = shadow.textContent = text + textToAdd;
        } else {
          shadow.innerText = shadow.textContent = '';
        }

      }, 0)

    }

    /**
     * Initialize Plugin
     * @public
     * @param {String} selector Selector of an element to initialize on
     * @param {Object} options User settings
     */
    exports.init = function ( selector, options ) {

        // feature test
        if ( !supports ) return;

        el = document.querySelector(selector);
        if(!el) throw Error('No elements match the selector');

        wrap(el, 'sef-wrapper');
        el = document.querySelector(selector);
        
        shadow = getShadowField(el);
        wrapper = document.querySelector('.sef-wrapper');
        prepend(wrapper, shadow);

        shadow = document.querySelector('.sef-shadow');

        addEvent(el, 'keydown', updateShadowText);

    };


    //
    // Public APIs
    //

    return exports;

});