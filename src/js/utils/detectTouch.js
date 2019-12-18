/* eslint-disable */

!(function(e, n, t) {
  function o(e) {
    let n = u.className;
      const t = Modernizr._config.classPrefix || '';
    if ((p && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      const o = new RegExp(`(^|\\s)${  t  }no-js(\\s|$)`);
      n = n.replace(o, `$1${  t  }js$2`);
    }
    Modernizr._config.enableClasses && ((n += ` ${  t  }${e.join(` ${  t}`)}`), p ? (u.className.baseVal = n) : (u.className = n));
  }
  function s(e, n) {
    return typeof e === n;
  }
  function a() {
    let e; let n; let t; let o; let a; let i; let r;
    for (const l in c)
      if (c.hasOwnProperty(l)) {
        if (((e = []), (n = c[l]), n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)))
          for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
        for (o = s(n.fn, 'function') ? n.fn() : n.fn, a = 0; a < e.length; a++)
          (i = e[a]),
            (r = i.split('.')),
            r.length === 1
              ? (Modernizr[r[0]] = o)
              : (!Modernizr[r[0]] || Modernizr[r[0]] instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), (Modernizr[r[0]][r[1]] = o)),
            f.push((o ? '' : 'no-') + r.join('-'));
      }
  }
  function i() {
    return typeof n.createElement !== 'function'
      ? n.createElement(arguments[0])
      : p
      ? n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function r() {
    let e = n.body;
    return e || ((e = i(p ? 'svg' : 'body')), (e.fake = !0)), e;
  }
  function l(e, t, o, s) {
    let a;
      let l;
      let f;
      let c;
      const d = 'modernizr';
      const p = i('div');
      const h = r();
    if (parseInt(o, 10)) for (; o--; ) (f = i('div')), (f.id = s ? s[o] : d + (o + 1)), p.appendChild(f);
    return (
      (a = i('style')),
      (a.type = 'text/css'),
      (a.id = `s${  d}`),
      (h.fake ? h : p).appendChild(a),
      h.appendChild(p),
      a.styleSheet ? (a.styleSheet.cssText = e) : a.appendChild(n.createTextNode(e)),
      (p.id = d),
      h.fake && ((h.style.background = ''), (h.style.overflow = 'hidden'), (c = u.style.overflow), (u.style.overflow = 'hidden'), u.appendChild(h)),
      (l = t(p, e)),
      h.fake ? (h.parentNode.removeChild(h), (u.style.overflow = c), u.offsetHeight) : p.parentNode.removeChild(p),
      !!l
    );
  }
  var f = [];
    var c = [];
    const d = {
      _version: '3.6.0',
      _config: {classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0},
      _q: [],
      on(e, n) {
        const t = this;
        setTimeout(function() {
          n(t[e]);
        }, 0);
      },
      addTest(e, n, t) {
        c.push({name: e, fn: n, options: t});
      },
      addAsyncTest(e) {
        c.push({name: null, fn: e});
      },
    };
    var Modernizr = function() {};
  (Modernizr.prototype = d), (Modernizr = new Modernizr());
  var u = n.documentElement;
    var p = u.nodeName.toLowerCase() === 'svg';
    const h = d._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['', ''];
  d._prefixes = h;
  const m = (d.testStyles = l);
  Modernizr.addTest('touchevents', function() {
    let t;
    if ('ontouchstart' in e || (e.DocumentTouch && n instanceof DocumentTouch)) t = !0;
    else {
      const o = ['@media (', h.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
      m(o, function(e) {
        t = e.offsetTop === 9;
      });
    }
    return t;
  }),
    a(),
    o(f),
    delete d.addTest,
    delete d.addAsyncTest;
  for (let v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
  e.Modernizr = Modernizr;
})(window, document);
