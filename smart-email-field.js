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

;(function (window, document, undefined) {
    'use strict';

    //
    // Variables
    //

    var pluginName = 'SmartEmailField';

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
    // function wrap(el, wrapperClass) {
    //   var oldHtml = el.outerHTML;
    //   var newHtml = '<div class="' + wrapperClass + '">' + oldHtml + '</div>';
    //   el.outerHTML = newHtml;
    //   return el;
    // }

    /**
     * Throttles a function
     * @private
     * @param {Function} callback - function to throttle
     * @param {Number} limit - miliseconds to throttle
     * @param {Object} ctx - optional context for callback to be called in
     * @returns {Function}
     */
    function throttle (callback, limit, ctx) {
      var wait = false;
      return function () {
        if (!wait) {
          callback.apply(ctx || null, arguments);
          wait = true;
          setTimeout(function () {
            wait = false;
          }, limit);
        }
      }
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

    function wrap(wrapper, elms) {
      if (!elms.length) elms = [elms];

      for (var i = elms.length - 1; i >= 0; i--) {
        var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
        var el = elms[i];

        var parent  = el.parentNode;
        var sibling = el.nextSibling;

        child.appendChild(el);

        if (sibling) {
          parent.insertBefore(child, sibling);
        } else {
          parent.appendChild(child);
        }
      }
    }

    /**
     * Get css of an element as a string
     * @private
     * @param {DOMNode} el
     * @returns {String}
     */
    function getElementCss(el) {
      var css = window.getComputedStyle(el, '');
      if(!css.cssText) {
        var cssText = '';
        for (var i=0; i<css.length; i++) {
          cssText += css[i] + ':' + css.getPropertyValue(css[i]) + ';';
        }
        return cssText;
      }
      return css.cssText;
    }

    function getShadowField(el) {
      var elCss = getElementCss(el);
      addStyle('.sef-wrapper--' + el.getAttribute('id') + ' .sef-shadow {' + elCss + '}');
      el.style.background = 'transparent';
      
      var shadow = document.createElement('div');
      shadow.classList.add('sef-shadow');
      Object.assign(shadow.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3
      });
      return shadow;
    }

    function getWrapperElement(el) {
      var wrapperEl = document.createElement('div');
      wrapperEl.classList.add('sef-wrapper');
      wrapperEl.classList.add('sef-wrapper--' + el.getAttribute('id'));
      Object.assign(wrapperEl.style, {
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden'
      });
      return wrapperEl;
    }

    /**
     * Updates shadow element's text to suggest email domains
     * @private
     * @param {DomEvent} ev
     * @returns {undefined}
     */
    SmartEmailField.prototype._updateShadowText = function(ev) {
      var that = this;

      if(isSpecialKey(ev) && !isDelete(ev) && !isBackspace(ev) && !isSpace(ev) && !isArrowRight(ev)) {
        return;
      }

      // handle firefox bugs

      setTimeout(function() {
        var text = ev.target.value;

        if(that.el.scrollWidth > that.el.clientWidth) {
          that.shadow.innerText = that.shadow.textContent = '';
          return;
        }

        if(isSpace(ev)) {
          text += ' ';
        }

        if(isArrowRight(ev)) {
          that.el.value = that.shadow.innerText || that.shadow.textContent;
          return;
        }

        var textToAdd = '';
        var atIndex = text.indexOf('@');
        if(atIndex !== -1) {
          var afterAt = text.substring(atIndex + 1);

          var foundDomain = '';
          for (var i = 0; i < EMAIL_DOMAINS.length && !foundDomain; i++) {
            if(EMAIL_DOMAINS[i] && EMAIL_DOMAINS[i].indexOf(afterAt) === 0) {
              foundDomain = EMAIL_DOMAINS[i];
            }
          }

          if(foundDomain) {
            textToAdd = foundDomain.substring(afterAt.length);
          }

          that.shadow.innerText = that.shadow.textContent = text + textToAdd;
        } else {
          that.shadow.innerText = that.shadow.textContent = '';
        }

      }, 0)

    }

    function SmartEmailField(selector, options) {
      this.el = selector instanceof Element ? selector : document.querySelector(selector);

      if(!this.el) throw Error('No elements match the selector');

      this._defaults = defaults;
      this._name = pluginName;
      this._selector = selector;

      extend(defaults, options);

      this.init();
      
      this.el.SmartEmailField = this;

      return this;
    }

    /**
     * Initialize Plugin
     * @public
     * @param {String} selector Selector of an element to initialize on
     * @param {Object} options User settings
     *                         options.emailDomains - email domains to use. Array of strings
     */
    SmartEmailField.prototype.init = function () {
      Object.assign(this.el.style, {
        zIndex: 1,
        position: 'relative'
      });

      this.wrapper = getWrapperElement(this.el);
      wrap(this.wrapper, this.el);

      this.shadow = getShadowField(this.el);
      prepend(this.wrapper, this.shadow);

      addEvent(this.el, 'keydown', this._updateShadowText.bind(this));
    };

    //
    // Public APIs
    //
    
    SmartEmailField.prototype.setEmailDomains = function (newEmailDomains) {
      options.emailDomains = newEmailDomains;
    }

    window.SmartEmailField = SmartEmailField;

})(window, document);