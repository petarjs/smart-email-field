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

(function (window, document) {
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
    }

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
     * Add an element before another
     * @private
     * @param {DOMNode} parent
     * @param {DOMNode} el
     * @returns {undefined}
     */
    function prepend(parent, el) {
      parent.insertBefore(el, parent.firstChild);
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
    SmartEmailField.prototype.addStyle = function(css) {
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
     * Wrap an element with a wrapper element
     * @private
     * @param {DOMNode} wrapper
     * @param {[DOMNode]} elms
     * @returns {undefined}
     */
    SmartEmailField.prototype.wrap = function(wrapper, elms) {
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
    SmartEmailField.prototype.getElementCss = function(el) {
      var css = window.getComputedStyle(el, '');
      if(!css.cssText) {
        // Firefox doesn't give us a nice cssText property, so we generate it ourselves
        var cssText = '';
        for (var i=0; i<css.length; i++) {
          cssText += css[i] + ':' + css.getPropertyValue(css[i]) + ';';
        }
        return cssText;
      }
      return css.cssText;
    }

    SmartEmailField.prototype.getShadowField = function(el) {
      var elCss = this.getElementCss(el);
      this.addStyle('.sef-wrapper--' + el.getAttribute('id') + ' .sef-shadow {' + elCss + '}');
      el.style.background = 'transparent';
      
      var shadow = document.createElement('div');
      shadow.classList.add('sef-shadow');

      var shadowStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '-webkit-text-fill-color': 'unset' // allow changing of text color
      };

      var additionalShadowStyle = this._defaults.shadowStyle || {
        opacity: 0.3
      };

      shadowStyle = extend(shadowStyle, additionalShadowStyle);

      Object.assign(shadow.style, shadowStyle);
      return shadow;
    }

    SmartEmailField.prototype.getWrapperElement = function(el) {
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
    /**
     * Constructor
     * @param {String|DOMElement} selector Selector of an element to initialize on, or DOM Element
     * @param {Object} options User settings
     */
    function SmartEmailField(selector, options) {
      this.el = selector instanceof Element ? selector : document.querySelector(selector);

      if(!this.el) throw Error('No elements match the selector');

      this._defaults = defaults;
      this._name = pluginName;
      this._selector = selector;

      extend(this._defaults, options);

      this.init();
      
      this.el.SmartEmailField = this;

      return this;
    }

    /**
     * Initialize Plugin
     * @public
     */
    SmartEmailField.prototype.init = function () {
      Object.assign(this.el.style, {
        zIndex: 1,
        position: 'relative'
      });

      this.wrapper = this.getWrapperElement(this.el);
      this.wrap(this.wrapper, this.el);

      this.shadow = this.getShadowField(this.el);
      prepend(this.wrapper, this.shadow);

      addEvent(this.el, 'keydown', this._updateShadowText.bind(this));
    };

    //
    // Public APIs
    //
    
    SmartEmailField.prototype.setEmailDomains = function (newEmailDomains) {
      this._defaults.emailDomains = newEmailDomains;
    }

    window.SmartEmailField = SmartEmailField;

})(window, document);