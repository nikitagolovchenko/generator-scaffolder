/*!
 * imagesLoaded PACKAGED v3.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function() {
  function e() {}
  function t(e, t) {
    for (let n = e.length; n--; ) if (e[n].listener === t) return n;
    return -1;
  }
  function n(e) {
    return function() {
      return this[e].apply(this, arguments);
    };
  }
  const i = e.prototype;

  const r = this;

  const o = r.EventEmitter;
  (i.getListeners = function(e) {
    let t;

    let n;

    const i = this._getEvents();
    if (typeof e === 'object') {
      t = {};
      for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n]);
    } else t = i[e] || (i[e] = []);
    return t;
  }),
    (i.flattenListeners = function(e) {
      let t;

      const n = [];
      for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
      return n;
    }),
    (i.getListenersAsObject = function(e) {
      let t;

      const n = this.getListeners(e);
      return n instanceof Array && ((t = {}), (t[e] = n)), t || n;
    }),
    (i.addListener = function(e, n) {
      let i;

      const r = this.getListenersAsObject(e);

      const o = typeof n === 'object';
      for (i in r) r.hasOwnProperty(i) && t(r[i], n) === -1 && r[i].push(o ? n : { listener: n, once: !1 });
      return this;
    }),
    (i.on = n('addListener')),
    (i.addOnceListener = function(e, t) {
      return this.addListener(e, { listener: t, once: !0 });
    }),
    (i.once = n('addOnceListener')),
    (i.defineEvent = function(e) {
      return this.getListeners(e), this;
    }),
    (i.defineEvents = function(e) {
      for (let t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
      return this;
    }),
    (i.removeListener = function(e, n) {
      let i;

      let r;

      const o = this.getListenersAsObject(e);
      for (r in o) o.hasOwnProperty(r) && ((i = t(o[r], n)), i !== -1 && o[r].splice(i, 1));
      return this;
    }),
    (i.off = n('removeListener')),
    (i.addListeners = function(e, t) {
      return this.manipulateListeners(!1, e, t);
    }),
    (i.removeListeners = function(e, t) {
      return this.manipulateListeners(!0, e, t);
    }),
    (i.manipulateListeners = function(e, t, n) {
      let i;

      let r;

      const o = e ? this.removeListener : this.addListener;

      const s = e ? this.removeListeners : this.addListeners;
      if (typeof t !== 'object' || t instanceof RegExp) for (i = n.length; i--; ) o.call(this, t, n[i]);
      else
        for (i in t)
          t.hasOwnProperty(i) && (r = t[i]) && (typeof r === 'function' ? o.call(this, i, r) : s.call(this, i, r));
      return this;
    }),
    (i.removeEvent = function(e) {
      let t;

      const n = typeof e;

      const i = this._getEvents();
      if (n === 'string') delete i[e];
      else if (n === 'object') for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
      else delete this._events;
      return this;
    }),
    (i.removeAllListeners = n('removeEvent')),
    (i.emitEvent = function(e, t) {
      let n;

      let i;

      let r;

      let o;

      const s = this.getListenersAsObject(e);
      for (r in s)
        if (s.hasOwnProperty(r))
          for (i = s[r].length; i--; )
            (n = s[r][i]),
              n.once === !0 && this.removeListener(e, n.listener),
              (o = n.listener.apply(this, t || [])),
              o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
      return this;
    }),
    (i.trigger = n('emitEvent')),
    (i.emit = function(e) {
      const t = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(e, t);
    }),
    (i.setOnceReturnValue = function(e) {
      return (this._onceReturnValue = e), this;
    }),
    (i._getOnceReturnValue = function() {
      return this.hasOwnProperty('_onceReturnValue') ? this._onceReturnValue : !0;
    }),
    (i._getEvents = function() {
      return this._events || (this._events = {});
    }),
    (e.noConflict = function() {
      return (r.EventEmitter = o), e;
    }),
    typeof define === 'function' && define.amd
      ? define('eventEmitter/EventEmitter', [], () => e)
      : typeof module === 'object' && module.exports
        ? (module.exports = e)
        : (this.EventEmitter = e);
}.call(this),
  (function(e) {
    function t(t) {
      const n = e.event;
      return (n.target = n.target || n.srcElement || t), n;
    }
    const n = document.documentElement;

    let i = function() {};
    n.addEventListener
      ? (i = function(e, t, n) {
          e.addEventListener(t, n, !1);
        })
      : n.attachEvent &&
        (i = function(e, n, i) {
          (e[n + i] = i.handleEvent
            ? function() {
                const n = t(e);
                i.handleEvent.call(i, n);
              }
            : function() {
                const n = t(e);
                i.call(e, n);
              }),
            e.attachEvent(`on${n}`, e[n + i]);
        });
    let r = function() {};
    n.removeEventListener
      ? (r = function(e, t, n) {
          e.removeEventListener(t, n, !1);
        })
      : n.detachEvent &&
        (r = function(e, t, n) {
          e.detachEvent(`on${t}`, e[t + n]);
          try {
            delete e[t + n];
          } catch (i) {
            e[t + n] = void 0;
          }
        });
    const o = { bind: i, unbind: r };
    typeof define === 'function' && define.amd ? define('eventie/eventie', o) : (e.eventie = o);
  })(this),
  (function(e, t) {
    typeof define === 'function' && define.amd
      ? define(['eventEmitter/EventEmitter', 'eventie/eventie'], (n, i) => t(e, n, i))
      : typeof exports === 'object'
        ? (module.exports = t(e, require('eventEmitter'), require('eventie')))
        : (e.imagesLoaded = t(e, e.EventEmitter, e.eventie));
  })(this, (e, t, n) => {
    function i(e, t) {
      for (const n in t) e[n] = t[n];
      return e;
    }
    function r(e) {
      return d.call(e) === '[object Array]';
    }
    function o(e) {
      let t = [];
      if (r(e)) t = e;
      else if (typeof e.length === 'number') for (let n = 0, i = e.length; i > n; n++) t.push(e[n]);
      else t.push(e);
      return t;
    }
    function s(e, t, n) {
      if (!(this instanceof s)) return new s(e, t);
      typeof e === 'string' && (e = document.querySelectorAll(e)),
        (this.elements = o(e)),
        (this.options = i({}, this.options)),
        typeof t === 'function' ? (n = t) : i(this.options, t),
        n && this.on('always', n),
        this.getImages(),
        a && (this.jqDeferred = new a.Deferred());
      const r = this;
      setTimeout(() => {
        r.check();
      });
    }
    function c(e) {
      this.img = e;
    }
    function f(e) {
      (this.src = e), (v[e] = this);
    }
    var a = e.jQuery;

    const u = e.console;

    const h = u !== void 0;

    var d = Object.prototype.toString;
    (s.prototype = new t()),
      (s.prototype.options = {}),
      (s.prototype.getImages = function() {
        this.images = [];
        for (let e = 0, t = this.elements.length; t > e; e++) {
          const n = this.elements[e];
          n.nodeName === 'IMG' && this.addImage(n);
          for (let i = n.querySelectorAll('img'), r = 0, o = i.length; o > r; r++) {
            const s = i[r];
            this.addImage(s);
          }
        }
      }),
      (s.prototype.addImage = function(e) {
        const t = new c(e);
        this.images.push(t);
      }),
      (s.prototype.check = function() {
        function e(e, r) {
          return t.options.debug && h && u.log('confirm', e, r), t.progress(e), n++, n === i && t.complete(), !0;
        }
        var t = this;

        var n = 0;

        var i = this.images.length;
        if (((this.hasAnyBroken = !1), !i)) return this.complete(), void 0;
        for (let r = 0; i > r; r++) {
          const o = this.images[r];
          o.on('confirm', e), o.check();
        }
      }),
      (s.prototype.progress = function(e) {
        this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
        const t = this;
        setTimeout(() => {
          t.emit('progress', t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e);
        });
      }),
      (s.prototype.complete = function() {
        const e = this.hasAnyBroken ? 'fail' : 'done';
        this.isComplete = !0;
        const t = this;
        setTimeout(() => {
          if ((t.emit(e, t), t.emit('always', t), t.jqDeferred)) {
            const n = t.hasAnyBroken ? 'reject' : 'resolve';
            t.jqDeferred[n](t);
          }
        });
      }),
      a &&
        (a.fn.imagesLoaded = function(e, t) {
          const n = new s(this, e, t);
          return n.jqDeferred.promise(a(this));
        }),
      (c.prototype = new t()),
      (c.prototype.check = function() {
        const e = v[this.img.src] || new f(this.img.src);
        if (e.isConfirmed) return this.confirm(e.isLoaded, 'cached was confirmed'), void 0;
        if (this.img.complete && void 0 !== this.img.naturalWidth)
          return this.confirm(this.img.naturalWidth !== 0, 'naturalWidth'), void 0;
        const t = this;
        e.on('confirm', (e, n) => t.confirm(e.isLoaded, n), !0), e.check();
      }),
      (c.prototype.confirm = function(e, t) {
        (this.isLoaded = e), this.emit('confirm', this, t);
      });
    var v = {};
    return (
      (f.prototype = new t()),
      (f.prototype.check = function() {
        if (!this.isChecked) {
          const e = new Image();
          n.bind(e, 'load', this), n.bind(e, 'error', this), (e.src = this.src), (this.isChecked = !0);
        }
      }),
      (f.prototype.handleEvent = function(e) {
        const t = `on${e.type}`;
        this[t] && this[t](e);
      }),
      (f.prototype.onload = function(e) {
        this.confirm(!0, 'onload'), this.unbindProxyEvents(e);
      }),
      (f.prototype.onerror = function(e) {
        this.confirm(!1, 'onerror'), this.unbindProxyEvents(e);
      }),
      (f.prototype.confirm = function(e, t) {
        (this.isConfirmed = !0), (this.isLoaded = e), this.emit('confirm', this, t);
      }),
      (f.prototype.unbindProxyEvents = function(e) {
        n.unbind(e.target, 'load', this), n.unbind(e.target, 'error', this);
      }),
      s
    );
  }));
