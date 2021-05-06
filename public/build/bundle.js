var app = (function () {
  'use strict';
  function e() {}
  function t(e) {
    return e();
  }
  function f() {
    return Object.create(null);
  }
  function s(e) {
    e.forEach(t);
  }
  function n(e) {
    return 'function' == typeof e;
  }
  function i(e, t) {
    return e != e
      ? t == t
      : e !== t || (e && 'object' == typeof e) || 'function' == typeof e;
  }
  function a(e, t, f, s) {
    return e[1] && s
      ? (function (e, t) {
          for (const f in t) e[f] = t[f];
          return e;
        })(f.ctx.slice(), e[1](s(t)))
      : f.ctx;
  }
  function o(e, t, f, s, n, i, o) {
    const r = (function (e, t, f, s) {
      if (e[2] && s) {
        const n = e[2](s(f));
        if (void 0 === t.dirty) return n;
        if ('object' == typeof n) {
          const e = [],
            f = Math.max(t.dirty.length, n.length);
          for (let s = 0; s < f; s += 1) e[s] = t.dirty[s] | n[s];
          return e;
        }
        return t.dirty | n;
      }
      return t.dirty;
    })(t, s, n, i);
    if (r) {
      const n = a(t, f, s, o);
      e.p(n, r);
    }
  }
  function r(e, t) {
    e.appendChild(t);
  }
  function c(e, t, f) {
    e.insertBefore(t, f || null);
  }
  function m(e) {
    e.parentNode.removeChild(e);
  }
  function T(e) {
    return document.createElement(e);
  }
  function O(e) {
    return document.createTextNode(e);
  }
  function u() {
    return O(' ');
  }
  function d(e, t, f) {
    null == f
      ? e.removeAttribute(t)
      : e.getAttribute(t) !== f && e.setAttribute(t, f);
  }
  function h(e, t) {
    (t = '' + t), e.wholeText !== t && (e.data = t);
  }
  function l(e, t, f, s) {
    e.style.setProperty(t, f, s ? 'important' : '');
  }
  let S;
  function D(e) {
    S = e;
  }
  function z(e) {
    (function () {
      if (!S)
        throw new Error('Function called outside component initialization');
      return S;
    })().$$.on_mount.push(e);
  }
  const A = [],
    p = [],
    g = [],
    y = [],
    $ = Promise.resolve();
  let b = !1;
  function k(e) {
    g.push(e);
  }
  let M = !1;
  const v = new Set();
  function w() {
    if (!M) {
      M = !0;
      do {
        for (let e = 0; e < A.length; e += 1) {
          const t = A[e];
          D(t), x(t.$$);
        }
        for (D(null), A.length = 0; p.length; ) p.pop()();
        for (let e = 0; e < g.length; e += 1) {
          const t = g[e];
          v.has(t) || (v.add(t), t());
        }
        g.length = 0;
      } while (A.length);
      for (; y.length; ) y.pop()();
      (b = !1), (M = !1), v.clear();
    }
  }
  function x(e) {
    if (null !== e.fragment) {
      e.update(), s(e.before_update);
      const t = e.dirty;
      (e.dirty = [-1]),
        e.fragment && e.fragment.p(e.ctx, t),
        e.after_update.forEach(k);
    }
  }
  const _ = new Set();
  let E;
  function P(e, t) {
    e && e.i && (_.delete(e), e.i(t));
  }
  function C(e, t, f, s) {
    if (e && e.o) {
      if (_.has(e)) return;
      _.add(e),
        E.c.push(() => {
          _.delete(e), s && (f && e.d(1), s());
        }),
        e.o(t);
    }
  }
  function I(e) {
    e && e.c();
  }
  function G(e, f, i, a) {
    const { fragment: o, on_mount: r, on_destroy: c, after_update: m } = e.$$;
    o && o.m(f, i),
      a ||
        k(() => {
          const f = r.map(t).filter(n);
          c ? c.push(...f) : s(f), (e.$$.on_mount = []);
        }),
      m.forEach(k);
  }
  function Y(e, t) {
    const f = e.$$;
    null !== f.fragment &&
      (s(f.on_destroy),
      f.fragment && f.fragment.d(t),
      (f.on_destroy = f.fragment = null),
      (f.ctx = []));
  }
  function H(e, t) {
    -1 === e.$$.dirty[0] &&
      (A.push(e), b || ((b = !0), $.then(w)), e.$$.dirty.fill(0)),
      (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
  }
  function B(t, n, i, a, o, r, c = [-1]) {
    const T = S;
    D(t);
    const O = (t.$$ = {
      fragment: null,
      ctx: null,
      props: r,
      update: e,
      not_equal: o,
      bound: f(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(T ? T.$$.context : n.context || []),
      callbacks: f(),
      dirty: c,
      skip_bound: !1,
    });
    let u = !1;
    if (
      ((O.ctx = i
        ? i(t, n.props || {}, (e, f, ...s) => {
            const n = s.length ? s[0] : f;
            return (
              O.ctx &&
                o(O.ctx[e], (O.ctx[e] = n)) &&
                (!O.skip_bound && O.bound[e] && O.bound[e](n), u && H(t, e)),
              f
            );
          })
        : []),
      O.update(),
      (u = !0),
      s(O.before_update),
      (O.fragment = !!a && a(O.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const e = (function (e) {
          return Array.from(e.childNodes);
        })(n.target);
        O.fragment && O.fragment.l(e), e.forEach(m);
      } else O.fragment && O.fragment.c();
      n.intro && P(t.$$.fragment),
        G(t, n.target, n.anchor, n.customElement),
        w();
    }
    D(T);
  }
  class L {
    $destroy() {
      Y(this, 1), (this.$destroy = e);
    }
    $on(e, t) {
      const f = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
      return (
        f.push(t),
        () => {
          const e = f.indexOf(t);
          -1 !== e && f.splice(e, 1);
        }
      );
    }
    $set(e) {
      var t;
      this.$$set &&
        ((t = e), 0 !== Object.keys(t).length) &&
        ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
    }
  }
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self && self;
  function N(e, t, f) {
    return (
      e(
        (f = {
          path: t,
          exports: {},
          require: function (e, t) {
            return (function () {
              throw new Error(
                'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
              );
            })(null == t && f.path);
          },
        }),
        f.exports
      ),
      f.exports
    );
  }
  var j = N(function (e, t) {
      e.exports = (function () {
        var e = 'millisecond',
          t = 'second',
          f = 'minute',
          s = 'hour',
          n = 'day',
          i = 'week',
          a = 'month',
          o = 'quarter',
          r = 'year',
          c = 'date',
          m = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
          T = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
          O = {
            name: 'en',
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
              '_'
            ),
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
              '_'
            ),
          },
          u = function (e, t, f) {
            var s = String(e);
            return !s || s.length >= t
              ? e
              : '' + Array(t + 1 - s.length).join(f) + e;
          },
          d = {
            s: u,
            z: function (e) {
              var t = -e.utcOffset(),
                f = Math.abs(t),
                s = Math.floor(f / 60),
                n = f % 60;
              return (t <= 0 ? '+' : '-') + u(s, 2, '0') + ':' + u(n, 2, '0');
            },
            m: function e(t, f) {
              if (t.date() < f.date()) return -e(f, t);
              var s = 12 * (f.year() - t.year()) + (f.month() - t.month()),
                n = t.clone().add(s, a),
                i = f - n < 0,
                o = t.clone().add(s + (i ? -1 : 1), a);
              return +(-(s + (f - n) / (i ? n - o : o - n)) || 0);
            },
            a: function (e) {
              return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
            },
            p: function (m) {
              return (
                { M: a, y: r, w: i, d: n, D: c, h: s, m: f, s: t, ms: e, Q: o }[
                  m
                ] ||
                String(m || '')
                  .toLowerCase()
                  .replace(/s$/, '')
              );
            },
            u: function (e) {
              return void 0 === e;
            },
          },
          h = 'en',
          l = {};
        l[h] = O;
        var S = function (e) {
            return e instanceof p;
          },
          D = function (e, t, f) {
            var s;
            if (!e) return h;
            if ('string' == typeof e)
              l[e] && (s = e), t && ((l[e] = t), (s = e));
            else {
              var n = e.name;
              (l[n] = e), (s = n);
            }
            return !f && s && (h = s), s || (!f && h);
          },
          z = function (e, t) {
            if (S(e)) return e.clone();
            var f = 'object' == typeof t ? t : {};
            return (f.date = e), (f.args = arguments), new p(f);
          },
          A = d;
        (A.l = D),
          (A.i = S),
          (A.w = function (e, t) {
            return z(e, {
              locale: t.$L,
              utc: t.$u,
              x: t.$x,
              $offset: t.$offset,
            });
          });
        var p = (function () {
            function O(e) {
              (this.$L = D(e.locale, null, !0)), this.parse(e);
            }
            var u = O.prototype;
            return (
              (u.parse = function (e) {
                (this.$d = (function (e) {
                  var t = e.date,
                    f = e.utc;
                  if (null === t) return new Date(NaN);
                  if (A.u(t)) return new Date();
                  if (t instanceof Date) return new Date(t);
                  if ('string' == typeof t && !/Z$/i.test(t)) {
                    var s = t.match(m);
                    if (s) {
                      var n = s[2] - 1 || 0,
                        i = (s[7] || '0').substring(0, 3);
                      return f
                        ? new Date(
                            Date.UTC(
                              s[1],
                              n,
                              s[3] || 1,
                              s[4] || 0,
                              s[5] || 0,
                              s[6] || 0,
                              i
                            )
                          )
                        : new Date(
                            s[1],
                            n,
                            s[3] || 1,
                            s[4] || 0,
                            s[5] || 0,
                            s[6] || 0,
                            i
                          );
                    }
                  }
                  return new Date(t);
                })(e)),
                  (this.$x = e.x || {}),
                  this.init();
              }),
              (u.init = function () {
                var e = this.$d;
                (this.$y = e.getFullYear()),
                  (this.$M = e.getMonth()),
                  (this.$D = e.getDate()),
                  (this.$W = e.getDay()),
                  (this.$H = e.getHours()),
                  (this.$m = e.getMinutes()),
                  (this.$s = e.getSeconds()),
                  (this.$ms = e.getMilliseconds());
              }),
              (u.$utils = function () {
                return A;
              }),
              (u.isValid = function () {
                return !('Invalid Date' === this.$d.toString());
              }),
              (u.isSame = function (e, t) {
                var f = z(e);
                return this.startOf(t) <= f && f <= this.endOf(t);
              }),
              (u.isAfter = function (e, t) {
                return z(e) < this.startOf(t);
              }),
              (u.isBefore = function (e, t) {
                return this.endOf(t) < z(e);
              }),
              (u.$g = function (e, t, f) {
                return A.u(e) ? this[t] : this.set(f, e);
              }),
              (u.unix = function () {
                return Math.floor(this.valueOf() / 1e3);
              }),
              (u.valueOf = function () {
                return this.$d.getTime();
              }),
              (u.startOf = function (e, o) {
                var m = this,
                  T = !!A.u(o) || o,
                  O = A.p(e),
                  u = function (e, t) {
                    var f = A.w(
                      m.$u ? Date.UTC(m.$y, t, e) : new Date(m.$y, t, e),
                      m
                    );
                    return T ? f : f.endOf(n);
                  },
                  d = function (e, t) {
                    return A.w(
                      m
                        .toDate()
                        [e].apply(
                          m.toDate('s'),
                          (T ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(t)
                        ),
                      m
                    );
                  },
                  h = this.$W,
                  l = this.$M,
                  S = this.$D,
                  D = 'set' + (this.$u ? 'UTC' : '');
                switch (O) {
                  case r:
                    return T ? u(1, 0) : u(31, 11);
                  case a:
                    return T ? u(1, l) : u(0, l + 1);
                  case i:
                    var z = this.$locale().weekStart || 0,
                      p = (h < z ? h + 7 : h) - z;
                    return u(T ? S - p : S + (6 - p), l);
                  case n:
                  case c:
                    return d(D + 'Hours', 0);
                  case s:
                    return d(D + 'Minutes', 1);
                  case f:
                    return d(D + 'Seconds', 2);
                  case t:
                    return d(D + 'Milliseconds', 3);
                  default:
                    return this.clone();
                }
              }),
              (u.endOf = function (e) {
                return this.startOf(e, !1);
              }),
              (u.$set = function (i, o) {
                var m,
                  T = A.p(i),
                  O = 'set' + (this.$u ? 'UTC' : ''),
                  u = ((m = {}),
                  (m[n] = O + 'Date'),
                  (m[c] = O + 'Date'),
                  (m[a] = O + 'Month'),
                  (m[r] = O + 'FullYear'),
                  (m[s] = O + 'Hours'),
                  (m[f] = O + 'Minutes'),
                  (m[t] = O + 'Seconds'),
                  (m[e] = O + 'Milliseconds'),
                  m)[T],
                  d = T === n ? this.$D + (o - this.$W) : o;
                if (T === a || T === r) {
                  var h = this.clone().set(c, 1);
                  h.$d[u](d),
                    h.init(),
                    (this.$d = h.set(c, Math.min(this.$D, h.daysInMonth())).$d);
                } else u && this.$d[u](d);
                return this.init(), this;
              }),
              (u.set = function (e, t) {
                return this.clone().$set(e, t);
              }),
              (u.get = function (e) {
                return this[A.p(e)]();
              }),
              (u.add = function (e, o) {
                var c,
                  m = this;
                e = Number(e);
                var T = A.p(o),
                  O = function (t) {
                    var f = z(m);
                    return A.w(f.date(f.date() + Math.round(t * e)), m);
                  };
                if (T === a) return this.set(a, this.$M + e);
                if (T === r) return this.set(r, this.$y + e);
                if (T === n) return O(1);
                if (T === i) return O(7);
                var u =
                    ((c = {}), (c[f] = 6e4), (c[s] = 36e5), (c[t] = 1e3), c)[
                      T
                    ] || 1,
                  d = this.$d.getTime() + e * u;
                return A.w(d, this);
              }),
              (u.subtract = function (e, t) {
                return this.add(-1 * e, t);
              }),
              (u.format = function (e) {
                var t = this;
                if (!this.isValid()) return 'Invalid Date';
                var f = e || 'YYYY-MM-DDTHH:mm:ssZ',
                  s = A.z(this),
                  n = this.$locale(),
                  i = this.$H,
                  a = this.$m,
                  o = this.$M,
                  r = n.weekdays,
                  c = n.months,
                  m = function (e, s, n, i) {
                    return (e && (e[s] || e(t, f))) || n[s].substr(0, i);
                  },
                  O = function (e) {
                    return A.s(i % 12 || 12, e, '0');
                  },
                  u =
                    n.meridiem ||
                    function (e, t, f) {
                      var s = e < 12 ? 'AM' : 'PM';
                      return f ? s.toLowerCase() : s;
                    },
                  d = {
                    YY: String(this.$y).slice(-2),
                    YYYY: this.$y,
                    M: o + 1,
                    MM: A.s(o + 1, 2, '0'),
                    MMM: m(n.monthsShort, o, c, 3),
                    MMMM: m(c, o),
                    D: this.$D,
                    DD: A.s(this.$D, 2, '0'),
                    d: String(this.$W),
                    dd: m(n.weekdaysMin, this.$W, r, 2),
                    ddd: m(n.weekdaysShort, this.$W, r, 3),
                    dddd: r[this.$W],
                    H: String(i),
                    HH: A.s(i, 2, '0'),
                    h: O(1),
                    hh: O(2),
                    a: u(i, a, !0),
                    A: u(i, a, !1),
                    m: String(a),
                    mm: A.s(a, 2, '0'),
                    s: String(this.$s),
                    ss: A.s(this.$s, 2, '0'),
                    SSS: A.s(this.$ms, 3, '0'),
                    Z: s,
                  };
                return f.replace(T, function (e, t) {
                  return t || d[e] || s.replace(':', '');
                });
              }),
              (u.utcOffset = function () {
                return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
              }),
              (u.diff = function (e, c, m) {
                var T,
                  O = A.p(c),
                  u = z(e),
                  d = 6e4 * (u.utcOffset() - this.utcOffset()),
                  h = this - u,
                  l = A.m(this, u);
                return (
                  (l =
                    ((T = {}),
                    (T[r] = l / 12),
                    (T[a] = l),
                    (T[o] = l / 3),
                    (T[i] = (h - d) / 6048e5),
                    (T[n] = (h - d) / 864e5),
                    (T[s] = h / 36e5),
                    (T[f] = h / 6e4),
                    (T[t] = h / 1e3),
                    T)[O] || h),
                  m ? l : A.a(l)
                );
              }),
              (u.daysInMonth = function () {
                return this.endOf(a).$D;
              }),
              (u.$locale = function () {
                return l[this.$L];
              }),
              (u.locale = function (e, t) {
                if (!e) return this.$L;
                var f = this.clone(),
                  s = D(e, t, !0);
                return s && (f.$L = s), f;
              }),
              (u.clone = function () {
                return A.w(this.$d, this);
              }),
              (u.toDate = function () {
                return new Date(this.valueOf());
              }),
              (u.toJSON = function () {
                return this.isValid() ? this.toISOString() : null;
              }),
              (u.toISOString = function () {
                return this.$d.toISOString();
              }),
              (u.toString = function () {
                return this.$d.toUTCString();
              }),
              O
            );
          })(),
          g = p.prototype;
        return (
          (z.prototype = g),
          [
            ['$ms', e],
            ['$s', t],
            ['$m', f],
            ['$H', s],
            ['$W', n],
            ['$M', a],
            ['$y', r],
            ['$D', c],
          ].forEach(function (e) {
            g[e[1]] = function (t) {
              return this.$g(t, e[0], e[1]);
            };
          }),
          (z.extend = function (e, t) {
            return e.$i || (e(t, p, z), (e.$i = !0)), z;
          }),
          (z.locale = D),
          (z.isDayjs = S),
          (z.unix = function (e) {
            return z(1e3 * e);
          }),
          (z.en = l[h]),
          (z.Ls = l),
          (z.p = {}),
          z
        );
      })();
    }),
    K = N(function (e, t) {
      var f, s, n, i, a, o, r, c, m, T, O, u;
      e.exports =
        ((n = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g),
        (i = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/),
        (a = {
          years: 31536e6,
          months: 2592e6,
          days: 864e5,
          hours: 36e5,
          minutes: 6e4,
          seconds: 1e3,
          milliseconds: 1,
          weeks: 6048e5,
        }),
        (o = function (e) {
          return e instanceof u;
        }),
        (r = function (e, t, f) {
          return new u(e, f, t.$l);
        }),
        (c = function (e) {
          return s.p(e) + 's';
        }),
        (m = function (e) {
          return e < 0;
        }),
        (T = function (e) {
          return m(e) ? Math.ceil(e) : Math.floor(e);
        }),
        (O = function (e, t) {
          return e
            ? m(e)
              ? {
                  negative: !0,
                  format:
                    '' +
                    (function (e) {
                      return Math.abs(e);
                    })(e) +
                    t,
                }
              : { negative: !1, format: '' + e + t }
            : { negative: !1, format: '' };
        }),
        (u = (function () {
          function e(e, t, f) {
            var s = this;
            if (((this.$d = {}), (this.$l = f), t)) return r(e * a[c(t)], this);
            if ('number' == typeof e)
              return (this.$ms = e), this.parseFromMilliseconds(), this;
            if ('object' == typeof e)
              return (
                Object.keys(e).forEach(function (t) {
                  s.$d[c(t)] = e[t];
                }),
                this.calMilliseconds(),
                this
              );
            if ('string' == typeof e) {
              var n = e.match(i);
              if (n)
                return (
                  (this.$d.years = n[2]),
                  (this.$d.months = n[3]),
                  (this.$d.weeks = n[4]),
                  (this.$d.days = n[5]),
                  (this.$d.hours = n[6]),
                  (this.$d.minutes = n[7]),
                  (this.$d.seconds = n[8]),
                  this.calMilliseconds(),
                  this
                );
            }
            return this;
          }
          var t = e.prototype;
          return (
            (t.calMilliseconds = function () {
              var e = this;
              this.$ms = Object.keys(this.$d).reduce(function (t, f) {
                return t + (e.$d[f] || 0) * a[f];
              }, 0);
            }),
            (t.parseFromMilliseconds = function () {
              var e = this.$ms;
              (this.$d.years = T(e / 31536e6)),
                (e %= 31536e6),
                (this.$d.months = T(e / 2592e6)),
                (e %= 2592e6),
                (this.$d.days = T(e / 864e5)),
                (e %= 864e5),
                (this.$d.hours = T(e / 36e5)),
                (e %= 36e5),
                (this.$d.minutes = T(e / 6e4)),
                (e %= 6e4),
                (this.$d.seconds = T(e / 1e3)),
                (e %= 1e3),
                (this.$d.milliseconds = e);
            }),
            (t.toISOString = function () {
              var e = O(this.$d.years, 'Y'),
                t = O(this.$d.months, 'M'),
                f = +this.$d.days || 0;
              this.$d.weeks && (f += 7 * this.$d.weeks);
              var s = O(f, 'D'),
                n = O(this.$d.hours, 'H'),
                i = O(this.$d.minutes, 'M'),
                a = this.$d.seconds || 0;
              this.$d.milliseconds && (a += this.$d.milliseconds / 1e3);
              var o = O(a, 'S'),
                r =
                  e.negative ||
                  t.negative ||
                  s.negative ||
                  n.negative ||
                  i.negative ||
                  o.negative,
                c = n.format || i.format || o.format ? 'T' : '',
                m =
                  (r ? '-' : '') +
                  'P' +
                  e.format +
                  t.format +
                  s.format +
                  c +
                  n.format +
                  i.format +
                  o.format;
              return 'P' === m || '-P' === m ? 'P0D' : m;
            }),
            (t.toJSON = function () {
              return this.toISOString();
            }),
            (t.format = function (e) {
              var t = e || 'YYYY-MM-DDTHH:mm:ss',
                f = {
                  Y: this.$d.years,
                  YY: s.s(this.$d.years, 2, '0'),
                  YYYY: s.s(this.$d.years, 4, '0'),
                  M: this.$d.months,
                  MM: s.s(this.$d.months, 2, '0'),
                  D: this.$d.days,
                  DD: s.s(this.$d.days, 2, '0'),
                  H: this.$d.hours,
                  HH: s.s(this.$d.hours, 2, '0'),
                  m: this.$d.minutes,
                  mm: s.s(this.$d.minutes, 2, '0'),
                  s: this.$d.seconds,
                  ss: s.s(this.$d.seconds, 2, '0'),
                  SSS: s.s(this.$d.milliseconds, 3, '0'),
                };
              return t.replace(n, function (e, t) {
                return t || String(f[e]);
              });
            }),
            (t.as = function (e) {
              return this.$ms / a[c(e)];
            }),
            (t.get = function (e) {
              var t = this.$ms,
                f = c(e);
              return (
                'milliseconds' === f
                  ? (t %= 1e3)
                  : (t = 'weeks' === f ? T(t / a[f]) : this.$d[f]),
                0 === t ? 0 : t
              );
            }),
            (t.add = function (e, t, f) {
              var s;
              return (
                (s = t ? e * a[c(t)] : o(e) ? e.$ms : r(e, this).$ms),
                r(this.$ms + s * (f ? -1 : 1), this)
              );
            }),
            (t.subtract = function (e, t) {
              return this.add(e, t, !0);
            }),
            (t.locale = function (e) {
              var t = this.clone();
              return (t.$l = e), t;
            }),
            (t.clone = function () {
              return r(this.$ms, this);
            }),
            (t.humanize = function (e) {
              return f().add(this.$ms, 'ms').locale(this.$l).fromNow(!e);
            }),
            (t.milliseconds = function () {
              return this.get('milliseconds');
            }),
            (t.asMilliseconds = function () {
              return this.as('milliseconds');
            }),
            (t.seconds = function () {
              return this.get('seconds');
            }),
            (t.asSeconds = function () {
              return this.as('seconds');
            }),
            (t.minutes = function () {
              return this.get('minutes');
            }),
            (t.asMinutes = function () {
              return this.as('minutes');
            }),
            (t.hours = function () {
              return this.get('hours');
            }),
            (t.asHours = function () {
              return this.as('hours');
            }),
            (t.days = function () {
              return this.get('days');
            }),
            (t.asDays = function () {
              return this.as('days');
            }),
            (t.weeks = function () {
              return this.get('weeks');
            }),
            (t.asWeeks = function () {
              return this.as('weeks');
            }),
            (t.months = function () {
              return this.get('months');
            }),
            (t.asMonths = function () {
              return this.as('months');
            }),
            (t.years = function () {
              return this.get('years');
            }),
            (t.asYears = function () {
              return this.as('years');
            }),
            e
          );
        })()),
        function (e, t, n) {
          (f = n),
            (s = n().$utils()),
            (n.duration = function (e, t) {
              var f = n.locale();
              return r(e, { $l: f }, t);
            }),
            (n.isDuration = o);
          var i = t.prototype.add,
            a = t.prototype.subtract;
          (t.prototype.add = function (e, t) {
            return o(e) && (e = e.asMilliseconds()), i.bind(this)(e, t);
          }),
            (t.prototype.subtract = function (e, t) {
              return o(e) && (e = e.asMilliseconds()), a.bind(this)(e, t);
            });
        });
    });
  const F = [
      { Timezone: 'Africa/Abidjan', Offset: '+00:00', 'DST Offset': '+00:00' },
      { Timezone: 'Africa/Accra', Offset: '+00:00', 'DST Offset': '+00:00' },
      { Timezone: 'Africa/Algiers', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Africa/Bissau', Offset: '+00:00', 'DST Offset': '+00:00' },
      { Timezone: 'Africa/Cairo', Offset: '+02:00', 'DST Offset': '+02:00' },
      {
        Timezone: 'Africa/Casablanca',
        Offset: '+01:00',
        'DST Offset': '+01:00',
      },
      { Timezone: 'Africa/Ceuta', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Africa/El_Aaiun', Offset: '+00:00', 'DST Offset': '+01:00' },
      {
        Timezone: 'Africa/Johannesburg',
        Offset: '+02:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Africa/Juba', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Africa/Khartoum', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'Africa/Lagos', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Africa/Maputo', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'Africa/Monrovia', Offset: '+00:00', 'DST Offset': '+00:00' },
      { Timezone: 'Africa/Nairobi', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Africa/Ndjamena', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Africa/Tripoli', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'Africa/Tunis', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Africa/Windhoek', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'America/Adak', Offset: '-10:00', 'DST Offset': '-09:00' },
      {
        Timezone: 'America/Anchorage',
        Offset: '-09:00',
        'DST Offset': '-08:00',
      },
      {
        Timezone: 'America/Araguaina',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Buenos_Aires',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Catamarca',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Cordoba',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Jujuy',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/La_Rioja',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Mendoza',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Rio_Gallegos',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Salta',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/San_Juan',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/San_Luis',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Tucuman',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Argentina/Ushuaia',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Asuncion',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Atikokan',
        Offset: '-05:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Bahia', Offset: '-03:00', 'DST Offset': '-03:00' },
      {
        Timezone: 'America/Bahia_Banderas',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Barbados',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/Belem', Offset: '-03:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Belize', Offset: '-06:00', 'DST Offset': '-06:00' },
      {
        Timezone: 'America/Blanc-Sablon',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Boa_Vista',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/Bogota', Offset: '-05:00', 'DST Offset': '-05:00' },
      { Timezone: 'America/Boise', Offset: '-07:00', 'DST Offset': '-06:00' },
      {
        Timezone: 'America/Cambridge_Bay',
        Offset: '-07:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Campo_Grande',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      { Timezone: 'America/Cancun', Offset: '-05:00', 'DST Offset': '-05:00' },
      { Timezone: 'America/Caracas', Offset: '-04:00', 'DST Offset': '-04:00' },
      { Timezone: 'America/Cayenne', Offset: '-03:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Chicago', Offset: '-06:00', 'DST Offset': '-05:00' },
      {
        Timezone: 'America/Chihuahua',
        Offset: '-07:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Costa_Rica',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      { Timezone: 'America/Creston', Offset: '-07:00', 'DST Offset': '-07:00' },
      { Timezone: 'America/Cuiaba', Offset: '-04:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Curacao', Offset: '-04:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/Danmarkshavn',
        Offset: '+00:00',
        'DST Offset': '+00:00',
      },
      { Timezone: 'America/Dawson', Offset: '-08:00', 'DST Offset': '-07:00' },
      {
        Timezone: 'America/Dawson_Creek',
        Offset: '-07:00',
        'DST Offset': '-07:00',
      },
      { Timezone: 'America/Denver', Offset: '-07:00', 'DST Offset': '-06:00' },
      { Timezone: 'America/Detroit', Offset: '-05:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/Edmonton',
        Offset: '-07:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Eirunepe',
        Offset: '-05:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/El_Salvador',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Fort_Nelson',
        Offset: '-07:00',
        'DST Offset': '-07:00',
      },
      {
        Timezone: 'America/Fortaleza',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Glace_Bay',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      { Timezone: 'America/Godthab', Offset: '-03:00', 'DST Offset': '-02:00' },
      {
        Timezone: 'America/Goose_Bay',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Grand_Turk',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Guatemala',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Guayaquil',
        Offset: '-05:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Guyana', Offset: '-04:00', 'DST Offset': '-04:00' },
      { Timezone: 'America/Halifax', Offset: '-04:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Havana', Offset: '-05:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/Hermosillo',
        Offset: '-07:00',
        'DST Offset': '-07:00',
      },
      {
        Timezone: 'America/Indiana/Indianapolis',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Indiana/Knox',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Indiana/Marengo',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Indiana/Petersburg',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Indiana/Tell_City',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Indiana/Vevay',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Indiana/Vincennes',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Indiana/Winamac',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/Inuvik', Offset: '-07:00', 'DST Offset': '-06:00' },
      { Timezone: 'America/Iqaluit', Offset: '-05:00', 'DST Offset': '-04:00' },
      { Timezone: 'America/Jamaica', Offset: '-05:00', 'DST Offset': '-05:00' },
      { Timezone: 'America/Juneau', Offset: '-09:00', 'DST Offset': '-08:00' },
      {
        Timezone: 'America/Kentucky/Louisville',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Kentucky/Monticello',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/La_Paz', Offset: '-04:00', 'DST Offset': '-04:00' },
      { Timezone: 'America/Lima', Offset: '-05:00', 'DST Offset': '-05:00' },
      {
        Timezone: 'America/Los_Angeles',
        Offset: '-08:00',
        'DST Offset': '-07:00',
      },
      { Timezone: 'America/Maceio', Offset: '-03:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Managua', Offset: '-06:00', 'DST Offset': '-06:00' },
      { Timezone: 'America/Manaus', Offset: '-04:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/Martinique',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Matamoros',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Mazatlan',
        Offset: '-07:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Menominee',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Merida', Offset: '-06:00', 'DST Offset': '-05:00' },
      {
        Timezone: 'America/Metlakatla',
        Offset: '-09:00',
        'DST Offset': '-08:00',
      },
      {
        Timezone: 'America/Mexico_City',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Miquelon',
        Offset: '-03:00',
        'DST Offset': '-02:00',
      },
      { Timezone: 'America/Moncton', Offset: '-04:00', 'DST Offset': '-03:00' },
      {
        Timezone: 'America/Monterrey',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Montevideo',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      { Timezone: 'America/Nassau', Offset: '-05:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/New_York',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/Nipigon', Offset: '-05:00', 'DST Offset': '-04:00' },
      { Timezone: 'America/Nome', Offset: '-09:00', 'DST Offset': '-08:00' },
      { Timezone: 'America/Noronha', Offset: '-02:00', 'DST Offset': '-02:00' },
      {
        Timezone: 'America/North_Dakota/Beulah',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/North_Dakota/Center',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/North_Dakota/New_Salem',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Ojinaga', Offset: '-07:00', 'DST Offset': '-06:00' },
      { Timezone: 'America/Panama', Offset: '-05:00', 'DST Offset': '-05:00' },
      {
        Timezone: 'America/Pangnirtung',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Paramaribo',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      { Timezone: 'America/Phoenix', Offset: '-07:00', 'DST Offset': '-07:00' },
      {
        Timezone: 'America/Port_of_Spain',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Port-au-Prince',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Porto_Velho',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Puerto_Rico',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Punta_Arenas',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Rainy_River',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Rankin_Inlet',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Recife', Offset: '-03:00', 'DST Offset': '-03:00' },
      { Timezone: 'America/Regina', Offset: '-06:00', 'DST Offset': '-06:00' },
      {
        Timezone: 'America/Resolute',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Rio_Branco',
        Offset: '-05:00',
        'DST Offset': '-05:00',
      },
      {
        Timezone: 'America/Santarem',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Santiago',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Santo_Domingo',
        Offset: '-04:00',
        'DST Offset': '-04:00',
      },
      {
        Timezone: 'America/Sao_Paulo',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'America/Scoresbysund',
        Offset: '-01:00',
        'DST Offset': '+00:00',
      },
      { Timezone: 'America/Sitka', Offset: '-09:00', 'DST Offset': '-08:00' },
      {
        Timezone: 'America/St_Johns',
        Offset: '-03:30',
        'DST Offset': '-02:30',
      },
      {
        Timezone: 'America/Swift_Current',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'America/Tegucigalpa',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      { Timezone: 'America/Thule', Offset: '-04:00', 'DST Offset': '-03:00' },
      {
        Timezone: 'America/Thunder_Bay',
        Offset: '-05:00',
        'DST Offset': '-04:00',
      },
      { Timezone: 'America/Tijuana', Offset: '-08:00', 'DST Offset': '-07:00' },
      { Timezone: 'America/Toronto', Offset: '-05:00', 'DST Offset': '-04:00' },
      {
        Timezone: 'America/Vancouver',
        Offset: '-08:00',
        'DST Offset': '-07:00',
      },
      {
        Timezone: 'America/Whitehorse',
        Offset: '-08:00',
        'DST Offset': '-07:00',
      },
      {
        Timezone: 'America/Winnipeg',
        Offset: '-06:00',
        'DST Offset': '-05:00',
      },
      { Timezone: 'America/Yakutat', Offset: '-09:00', 'DST Offset': '-08:00' },
      {
        Timezone: 'America/Yellowknife',
        Offset: '-07:00',
        'DST Offset': '-06:00',
      },
      {
        Timezone: 'Antarctica/Casey',
        Offset: '+11:00',
        'DST Offset': '+11:00',
      },
      {
        Timezone: 'Antarctica/Davis',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      {
        Timezone: 'Antarctica/DumontDUrville',
        Offset: '+10:00',
        'DST Offset': '+10:00',
      },
      {
        Timezone: 'Antarctica/Macquarie',
        Offset: '+11:00',
        'DST Offset': '+11:00',
      },
      {
        Timezone: 'Antarctica/Mawson',
        Offset: '+05:00',
        'DST Offset': '+05:00',
      },
      {
        Timezone: 'Antarctica/Palmer',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'Antarctica/Rothera',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'Antarctica/Syowa',
        Offset: '+03:00',
        'DST Offset': '+03:00',
      },
      {
        Timezone: 'Antarctica/Troll',
        Offset: '+00:00',
        'DST Offset': '+02:00',
      },
      {
        Timezone: 'Antarctica/Vostok',
        Offset: '+06:00',
        'DST Offset': '+06:00',
      },
      { Timezone: 'Asia/Almaty', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Amman', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Anadyr', Offset: '+12:00', 'DST Offset': '+12:00' },
      { Timezone: 'Asia/Aqtau', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Aqtobe', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Ashgabat', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Atyrau', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Baghdad', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Baku', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Asia/Bangkok', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Asia/Barnaul', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Asia/Beirut', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Bishkek', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Brunei', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Chita', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Choibalsan', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Colombo', Offset: '+05:30', 'DST Offset': '+05:30' },
      { Timezone: 'Asia/Damascus', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Dhaka', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Dili', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Dubai', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Asia/Dushanbe', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Famagusta', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'Asia/Gaza', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Hebron', Offset: '+02:00', 'DST Offset': '+03:00' },
      {
        Timezone: 'Asia/Ho_Chi_Minh',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      { Timezone: 'Asia/Hong_Kong', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Hovd', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Asia/Irkutsk', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Jakarta', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Asia/Jayapura', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Jerusalem', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Kabul', Offset: '+04:30', 'DST Offset': '+04:30' },
      { Timezone: 'Asia/Kamchatka', Offset: '+12:00', 'DST Offset': '+12:00' },
      { Timezone: 'Asia/Karachi', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Kathmandu', Offset: '+05:45', 'DST Offset': '+05:45' },
      { Timezone: 'Asia/Khandyga', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Kolkata', Offset: '+05:30', 'DST Offset': '+05:30' },
      {
        Timezone: 'Asia/Krasnoyarsk',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      {
        Timezone: 'Asia/Kuala_Lumpur',
        Offset: '+08:00',
        'DST Offset': '+08:00',
      },
      { Timezone: 'Asia/Kuching', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Macau', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Magadan', Offset: '+11:00', 'DST Offset': '+11:00' },
      { Timezone: 'Asia/Makassar', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Manila', Offset: '+08:00', 'DST Offset': '+08:00' },
      {
        Timezone: 'Asia/Novokuznetsk',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      {
        Timezone: 'Asia/Novosibirsk',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      { Timezone: 'Asia/Omsk', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Oral', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Pontianak', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Asia/Pyongyang', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Qatar', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Qyzylorda', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Riyadh', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Sakhalin', Offset: '+11:00', 'DST Offset': '+11:00' },
      { Timezone: 'Asia/Samarkand', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Seoul', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Shanghai', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Singapore', Offset: '+08:00', 'DST Offset': '+08:00' },
      {
        Timezone: 'Asia/Srednekolymsk',
        Offset: '+11:00',
        'DST Offset': '+11:00',
      },
      { Timezone: 'Asia/Taipei', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Asia/Tashkent', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Asia/Tbilisi', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Asia/Tehran', Offset: '+03:30', 'DST Offset': '+04:30' },
      { Timezone: 'Asia/Thimphu', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Tokyo', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Tomsk', Offset: '+07:00', 'DST Offset': '+07:00' },
      {
        Timezone: 'Asia/Ulaanbaatar',
        Offset: '+08:00',
        'DST Offset': '+08:00',
      },
      { Timezone: 'Asia/Urumqi', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Asia/Ust-Nera', Offset: '+10:00', 'DST Offset': '+10:00' },
      {
        Timezone: 'Asia/Vladivostok',
        Offset: '+10:00',
        'DST Offset': '+10:00',
      },
      { Timezone: 'Asia/Yakutsk', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Asia/Yangon', Offset: '+06:30', 'DST Offset': '+06:30' },
      {
        Timezone: 'Asia/Yekaterinburg',
        Offset: '+05:00',
        'DST Offset': '+05:00',
      },
      { Timezone: 'Asia/Yerevan', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Atlantic/Azores', Offset: '-01:00', 'DST Offset': '+00:00' },
      {
        Timezone: 'Atlantic/Bermuda',
        Offset: '-04:00',
        'DST Offset': '-03:00',
      },
      { Timezone: 'Atlantic/Canary', Offset: '+00:00', 'DST Offset': '+01:00' },
      {
        Timezone: 'Atlantic/Cape_Verde',
        Offset: '-01:00',
        'DST Offset': '-01:00',
      },
      { Timezone: 'Atlantic/Faroe', Offset: '+00:00', 'DST Offset': '+01:00' },
      {
        Timezone: 'Atlantic/Madeira',
        Offset: '+00:00',
        'DST Offset': '+01:00',
      },
      {
        Timezone: 'Atlantic/Reykjavik',
        Offset: '+00:00',
        'DST Offset': '+00:00',
      },
      {
        Timezone: 'Atlantic/South_Georgia',
        Offset: '-02:00',
        'DST Offset': '-02:00',
      },
      {
        Timezone: 'Atlantic/Stanley',
        Offset: '-03:00',
        'DST Offset': '-03:00',
      },
      {
        Timezone: 'Australia/Adelaide',
        Offset: '+09:30',
        'DST Offset': '+10:30',
      },
      {
        Timezone: 'Australia/Brisbane',
        Offset: '+10:00',
        'DST Offset': '+10:00',
      },
      {
        Timezone: 'Australia/Broken_Hill',
        Offset: '+09:30',
        'DST Offset': '+10:30',
      },
      {
        Timezone: 'Australia/Currie',
        Offset: '+10:00',
        'DST Offset': '+11:00',
      },
      {
        Timezone: 'Australia/Darwin',
        Offset: '+09:30',
        'DST Offset': '+09:30',
      },
      { Timezone: 'Australia/Eucla', Offset: '+08:45', 'DST Offset': '+08:45' },
      {
        Timezone: 'Australia/Hobart',
        Offset: '+10:00',
        'DST Offset': '+11:00',
      },
      {
        Timezone: 'Australia/Lindeman',
        Offset: '+10:00',
        'DST Offset': '+10:00',
      },
      {
        Timezone: 'Australia/Lord_Howe',
        Offset: '+10:30',
        'DST Offset': '+11:00',
      },
      {
        Timezone: 'Australia/Melbourne',
        Offset: '+10:00',
        'DST Offset': '+11:00',
      },
      { Timezone: 'Australia/Perth', Offset: '+08:00', 'DST Offset': '+08:00' },
      {
        Timezone: 'Australia/Sydney',
        Offset: '+10:00',
        'DST Offset': '+11:00',
      },
      { Timezone: 'Etc/GMT', Offset: '+00:00', 'DST Offset': '+00:00' },
      { Timezone: 'Etc/GMT+1', Offset: '-01:00', 'DST Offset': '-01:00' },
      { Timezone: 'Etc/GMT+10', Offset: '-10:00', 'DST Offset': '-10:00' },
      { Timezone: 'Etc/GMT+11', Offset: '-11:00', 'DST Offset': '-11:00' },
      { Timezone: 'Etc/GMT+12', Offset: '-12:00', 'DST Offset': '-12:00' },
      { Timezone: 'Etc/GMT+2', Offset: '-02:00', 'DST Offset': '-02:00' },
      { Timezone: 'Etc/GMT+3', Offset: '-03:00', 'DST Offset': '-03:00' },
      { Timezone: 'Etc/GMT+4', Offset: '-04:00', 'DST Offset': '-04:00' },
      { Timezone: 'Etc/GMT+5', Offset: '-05:00', 'DST Offset': '-05:00' },
      { Timezone: 'Etc/GMT+6', Offset: '-06:00', 'DST Offset': '-06:00' },
      { Timezone: 'Etc/GMT+7', Offset: '-07:00', 'DST Offset': '-07:00' },
      { Timezone: 'Etc/GMT+8', Offset: '-08:00', 'DST Offset': '-08:00' },
      { Timezone: 'Etc/GMT+9', Offset: '-09:00', 'DST Offset': '-09:00' },
      { Timezone: 'Etc/GMT-1', Offset: '+01:00', 'DST Offset': '+01:00' },
      { Timezone: 'Etc/GMT-10', Offset: '+10:00', 'DST Offset': '+10:00' },
      { Timezone: 'Etc/GMT-11', Offset: '+11:00', 'DST Offset': '+11:00' },
      { Timezone: 'Etc/GMT-12', Offset: '+12:00', 'DST Offset': '+12:00' },
      { Timezone: 'Etc/GMT-13', Offset: '+13:00', 'DST Offset': '+13:00' },
      { Timezone: 'Etc/GMT-14', Offset: '+14:00', 'DST Offset': '+14:00' },
      { Timezone: 'Etc/GMT-2', Offset: '+02:00', 'DST Offset': '+02:00' },
      { Timezone: 'Etc/GMT-3', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Etc/GMT-4', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Etc/GMT-5', Offset: '+05:00', 'DST Offset': '+05:00' },
      { Timezone: 'Etc/GMT-6', Offset: '+06:00', 'DST Offset': '+06:00' },
      { Timezone: 'Etc/GMT-7', Offset: '+07:00', 'DST Offset': '+07:00' },
      { Timezone: 'Etc/GMT-8', Offset: '+08:00', 'DST Offset': '+08:00' },
      { Timezone: 'Etc/GMT-9', Offset: '+09:00', 'DST Offset': '+09:00' },
      { Timezone: 'Etc/UTC', Offset: '+00:00', 'DST Offset': '+00:00' },
      {
        Timezone: 'Europe/Amsterdam',
        Offset: '+01:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Andorra', Offset: '+01:00', 'DST Offset': '+02:00' },
      {
        Timezone: 'Europe/Astrakhan',
        Offset: '+04:00',
        'DST Offset': '+04:00',
      },
      { Timezone: 'Europe/Athens', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Belgrade', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Berlin', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Brussels', Offset: '+01:00', 'DST Offset': '+02:00' },
      {
        Timezone: 'Europe/Bucharest',
        Offset: '+02:00',
        'DST Offset': '+03:00',
      },
      { Timezone: 'Europe/Budapest', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Chisinau', Offset: '+02:00', 'DST Offset': '+03:00' },
      {
        Timezone: 'Europe/Copenhagen',
        Offset: '+01:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Dublin', Offset: '+00:00', 'DST Offset': '+01:00' },
      {
        Timezone: 'Europe/Gibraltar',
        Offset: '+01:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Helsinki', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Istanbul', Offset: '+03:00', 'DST Offset': '+03:00' },
      {
        Timezone: 'Europe/Kaliningrad',
        Offset: '+02:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Kiev', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Kirov', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Lisbon', Offset: '+00:00', 'DST Offset': '+01:00' },
      { Timezone: 'Europe/London', Offset: '+00:00', 'DST Offset': '+01:00' },
      {
        Timezone: 'Europe/Luxembourg',
        Offset: '+01:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Madrid', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Malta', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Minsk', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Monaco', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Moscow', Offset: '+03:00', 'DST Offset': '+03:00' },
      { Timezone: 'Asia/Nicosia', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Oslo', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Paris', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Prague', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Riga', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Rome', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Samara', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Europe/Saratov', Offset: '+04:00', 'DST Offset': '+04:00' },
      {
        Timezone: 'Europe/Simferopol',
        Offset: '+03:00',
        'DST Offset': '+03:00',
      },
      { Timezone: 'Europe/Sofia', Offset: '+02:00', 'DST Offset': '+03:00' },
      {
        Timezone: 'Europe/Stockholm',
        Offset: '+01:00',
        'DST Offset': '+02:00',
      },
      { Timezone: 'Europe/Tallinn', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Tirane', Offset: '+01:00', 'DST Offset': '+02:00' },
      {
        Timezone: 'Europe/Ulyanovsk',
        Offset: '+04:00',
        'DST Offset': '+04:00',
      },
      { Timezone: 'Europe/Uzhgorod', Offset: '+02:00', 'DST Offset': '+03:00' },
      { Timezone: 'Europe/Vienna', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Europe/Vilnius', Offset: '+02:00', 'DST Offset': '+03:00' },
      {
        Timezone: 'Europe/Volgograd',
        Offset: '+04:00',
        'DST Offset': '+04:00',
      },
      { Timezone: 'Europe/Warsaw', Offset: '+01:00', 'DST Offset': '+02:00' },
      {
        Timezone: 'Europe/Zaporozhye',
        Offset: '+02:00',
        'DST Offset': '+03:00',
      },
      { Timezone: 'Europe/Zurich', Offset: '+01:00', 'DST Offset': '+02:00' },
      { Timezone: 'Indian/Chagos', Offset: '+06:00', 'DST Offset': '+06:00' },
      {
        Timezone: 'Indian/Christmas',
        Offset: '+07:00',
        'DST Offset': '+07:00',
      },
      { Timezone: 'Indian/Cocos', Offset: '+06:30', 'DST Offset': '+06:30' },
      {
        Timezone: 'Indian/Kerguelen',
        Offset: '+05:00',
        'DST Offset': '+05:00',
      },
      { Timezone: 'Indian/Mahe', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Indian/Maldives', Offset: '+05:00', 'DST Offset': '+05:00' },
      {
        Timezone: 'Indian/Mauritius',
        Offset: '+04:00',
        'DST Offset': '+04:00',
      },
      { Timezone: 'Indian/Reunion', Offset: '+04:00', 'DST Offset': '+04:00' },
      { Timezone: 'Pacific/Apia', Offset: '+13:00', 'DST Offset': '+14:00' },
      {
        Timezone: 'Pacific/Auckland',
        Offset: '+12:00',
        'DST Offset': '+13:00',
      },
      {
        Timezone: 'Pacific/Bougainville',
        Offset: '+11:00',
        'DST Offset': '+11:00',
      },
      { Timezone: 'Pacific/Chatham', Offset: '+12:45', 'DST Offset': '+13:45' },
      { Timezone: 'Pacific/Chuuk', Offset: '+10:00', 'DST Offset': '+10:00' },
      { Timezone: 'Pacific/Easter', Offset: '-06:00', 'DST Offset': '-05:00' },
      { Timezone: 'Pacific/Efate', Offset: '+11:00', 'DST Offset': '+11:00' },
      {
        Timezone: 'Pacific/Enderbury',
        Offset: '+13:00',
        'DST Offset': '+13:00',
      },
      { Timezone: 'Pacific/Fakaofo', Offset: '+13:00', 'DST Offset': '+13:00' },
      { Timezone: 'Pacific/Fiji', Offset: '+12:00', 'DST Offset': '+13:00' },
      {
        Timezone: 'Pacific/Funafuti',
        Offset: '+12:00',
        'DST Offset': '+12:00',
      },
      {
        Timezone: 'Pacific/Galapagos',
        Offset: '-06:00',
        'DST Offset': '-06:00',
      },
      { Timezone: 'Pacific/Gambier', Offset: '-09:00', 'DST Offset': '-09:00' },
      {
        Timezone: 'Pacific/Guadalcanal',
        Offset: '+11:00',
        'DST Offset': '+11:00',
      },
      { Timezone: 'Pacific/Guam', Offset: '+10:00', 'DST Offset': '+10:00' },
      {
        Timezone: 'Pacific/Honolulu',
        Offset: '-10:00',
        'DST Offset': '-10:00',
      },
      {
        Timezone: 'Pacific/Kiritimati',
        Offset: '+14:00',
        'DST Offset': '+14:00',
      },
      { Timezone: 'Pacific/Kosrae', Offset: '+11:00', 'DST Offset': '+11:00' },
      {
        Timezone: 'Pacific/Kwajalein',
        Offset: '+12:00',
        'DST Offset': '+12:00',
      },
      { Timezone: 'Pacific/Majuro', Offset: '+12:00', 'DST Offset': '+12:00' },
      {
        Timezone: 'Pacific/Marquesas',
        Offset: '-09:30',
        'DST Offset': '-09:30',
      },
      { Timezone: 'Pacific/Nauru', Offset: '+12:00', 'DST Offset': '+12:00' },
      { Timezone: 'Pacific/Niue', Offset: '-11:00', 'DST Offset': '-11:00' },
      { Timezone: 'Pacific/Norfolk', Offset: '+11:00', 'DST Offset': '+11:00' },
      { Timezone: 'Pacific/Noumea', Offset: '+11:00', 'DST Offset': '+11:00' },
      {
        Timezone: 'Pacific/Pago_Pago',
        Offset: '-11:00',
        'DST Offset': '-11:00',
      },
      { Timezone: 'Pacific/Palau', Offset: '+09:00', 'DST Offset': '+09:00' },
      {
        Timezone: 'Pacific/Pitcairn',
        Offset: '-08:00',
        'DST Offset': '-08:00',
      },
      { Timezone: 'Pacific/Pohnpei', Offset: '+11:00', 'DST Offset': '+11:00' },
      {
        Timezone: 'Pacific/Port_Moresby',
        Offset: '+10:00',
        'DST Offset': '+10:00',
      },
      {
        Timezone: 'Pacific/Rarotonga',
        Offset: '-10:00',
        'DST Offset': '-10:00',
      },
      { Timezone: 'Pacific/Tahiti', Offset: '-10:00', 'DST Offset': '-10:00' },
      { Timezone: 'Pacific/Tarawa', Offset: '+12:00', 'DST Offset': '+12:00' },
      {
        Timezone: 'Pacific/Tongatapu',
        Offset: '+13:00',
        'DST Offset': '+14:00',
      },
      { Timezone: 'Pacific/Wake', Offset: '+12:00', 'DST Offset': '+12:00' },
      { Timezone: 'Pacific/Wallis', Offset: '+12:00', 'DST Offset': '+12:00' },
    ],
    R = (e) => ({ remaining: 1 & e }),
    W = (e) => ({ remaining: e[0] });
  function J(e) {
    let t;
    const f = e[5].default,
      s = (function (e, t, f, s) {
        if (e) {
          const n = a(e, t, f, s);
          return e[0](n);
        }
      })(f, e, e[4], W);
    return {
      c() {
        s && s.c();
      },
      m(e, f) {
        s && s.m(e, f), (t = !0);
      },
      p(e, [t]) {
        s && s.p && 17 & t && o(s, f, e, e[4], t, R, W);
      },
      i(e) {
        t || (P(s, e), (t = !0));
      },
      o(e) {
        C(s, e), (t = !1);
      },
      d(e) {
        s && s.d(e);
      },
    };
  }
  function U(e, t) {
    let f = '-' == t.Offset.charAt(0),
      s = t.Offset.split(':').map(function (e) {
        return parseInt(e);
      });
    if (t.Offset == t['DST Offset'])
      return 0 === s[0] && 0 === s[1]
        ? 0
        : parseInt((f ? '-' : '') + 60 * s[0] + s[1]);
    {
      let n,
        i = t['DST Offset'].split(':').map(function (e) {
          return parseInt(e);
        }),
        a = !1;
      if (0 === t.Timezone.indexOf('Europe'))
        switch (!0) {
          case e.month() > 2 && e.month() < 9:
            a = !0;
            break;
          case 2 == e.month():
            for (n = e.endOf('month'); 0 != n.day(); ) n = n.subtrack(1, 'day');
            e.date() == n.date()
              ? e.hour() > s[0] + 1 && (a = !0)
              : e.date() > n.date() && (a = !0);
            break;
          case 9 == e.month():
            for (n = e.endOf('month'); 0 != n.day(); ) n = n.subtrack(1, 'day');
            e.date() == n.date()
              ? e.hour() < s[0] + 1 && (a = !0)
              : e.date() < n.date() && (a = !0);
        }
      else
        switch (t.Timezone) {
          case 'America/Havana':
            switch (!0) {
              case e.month() > 2 && e.month() < 9:
                a = !0;
                break;
              case 2 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                n.add(14, 'day'),
                  e.date() == n.date()
                    ? e.hour() > 2 && (a = !0)
                    : e.date() > n.date() && (a = !0);
                break;
              case 9 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'America/Mexico_City':
            switch (!0) {
              case e.month() > 3 && e.month() < 9:
                a = !0;
                break;
              case 3 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 9 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'America/Campo_Grande':
          case 'America/Cuiaba':
            switch (!0) {
              case e.month() > 9 || e.month() < 1:
                a = !0;
                break;
              case 9 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                n.add(14, 'day'),
                  e.date() == n.date()
                    ? e.hour() > 2 && (a = !0)
                    : e.date() > n.date() && (a = !0);
                break;
              case 1 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                n.add(14, 'day'),
                  e.date() == n.date()
                    ? e.hour() < 2 && (a = !0)
                    : e.date() < n.date() && (a = !0);
            }
            break;
          case 'America/Santiago':
          case 'Pacific/Easter':
            switch (!0) {
              case e.month() > 9 || e.month() < 2:
                a = !0;
                break;
              case 9 == e.month():
                11 == e.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > 11 && (a = !0);
                break;
              case 2 == e.month():
                29 == e.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < 29 && (a = !0);
            }
            break;
          case 'America/Asuncion':
            switch (!0) {
              case e.month() > 9 || e.month() < 2:
                a = !0;
                break;
              case 9 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                n.add(14, 'day'),
                  e.date() == n.date()
                    ? e.hour() > 2 && (a = !0)
                    : e.date() > n.date() && (a = !0);
                break;
              case 2 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                n.add(7, 'day'),
                  e.date() == n.date()
                    ? e.hour() < 2 && (a = !0)
                    : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Africa/Cairo':
            switch (!0) {
              case e.month() > 3 && e.month() < 8:
                a = !0;
                break;
              case 3 == e.month():
                for (n = e.endOf('month'); 5 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 8 == e.month():
                for (n = e.endOf('month'); 4 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Asia/Jerusalem':
            switch (!0) {
              case e.month() > 2 && e.month() < 9:
                a = !0;
                break;
              case 2 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                n.subtrack(2, 'day'),
                  e.date() == n.date()
                    ? e.hour() > 2 && (a = !0)
                    : e.date() > n.date() && (a = !0);
                break;
              case 9 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Asia/Amman':
            switch (!0) {
              case e.month() > 2 && e.month() < 8:
                a = !0;
                break;
              case 2 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 8 == e.month():
                for (n = e.endOf('month'); 5 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Asia/Beirut':
            switch (!0) {
              case e.month() > 2 && e.month() < 9:
                a = !0;
                break;
              case 2 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 9 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Asia/Damascus':
            switch (!0) {
              case e.month() > 2 && e.month() < 8:
                a = !0;
                break;
              case 2 == e.month():
                30 == e.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > 30 && (a = !0);
                break;
              case 8 == e.month():
                21 == e.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < 21 && (a = !0);
            }
            break;
          case 'Australia/Tasmania':
            switch (!0) {
              case e.month() > 9 || e.month() < 2:
                a = !0;
                break;
              case 9 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 2 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Pacific/Auckland':
          case 'Pacific/Chatham':
            switch (!0) {
              case e.month() > 8 || e.month() < 3:
                a = !0;
                break;
              case 8 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 3 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          case 'Pacific/Tongatapu':
            switch (!0) {
              case e.month() > 10:
                a = !0;
                break;
              case 10 == e.month():
                for (n = e.startOf('month'); 0 != n.day(); )
                  n = n.add(1, 'day');
                e.date() == n.date()
                  ? e.hour() > 2 && (a = !0)
                  : e.date() > n.date() && (a = !0);
                break;
              case 0 == e.month():
                for (n = e.endOf('month'); 0 != n.day(); )
                  n = n.subtrack(1, 'day');
                e.date() == n.date()
                  ? e.hour() < 2 && (a = !0)
                  : e.date() < n.date() && (a = !0);
            }
            break;
          default:
            if (0 === t.Timezone.indexOf('Australia'))
              switch (!0) {
                case e.month() > 9 || e.month() < 3:
                  a = !0;
                  break;
                case 9 == e.month():
                  for (n = e.startOf('month'); 0 != n.day(); )
                    n = n.add(1, 'day');
                  e.date() == n.date()
                    ? e.hour() > 2 && (a = !0)
                    : e.date() > n.date() && (a = !0);
                  break;
                case 3 == e.month():
                  for (n = e.startOf('month'); 0 != n.day(); )
                    n = n.add(1, 'day');
                  e.date() == n.date()
                    ? e.hour() < 2 && (a = !0)
                    : e.date() < n.date() && (a = !0);
              }
            else
              switch (!0) {
                case e.month() > 2 && e.month() < 10:
                  a = !0;
                  break;
                case 2 == e.month():
                  for (n = e.startOf('month'); 0 != n.day(); )
                    n = n.add(1, 'day');
                  n.add(7, 'day'),
                    e.date() == n.date()
                      ? e.hour() > 2 && (a = !0)
                      : e.date() > n.date() && (a = !0);
                  break;
                case 10 == e.month():
                  for (n = e.startOf('month'); 0 != n.day(); )
                    n = n.add(1, 'day');
                  e.date() == n.date()
                    ? e.hour() < 2 && (a = !0)
                    : e.date() < n.date() && (a = !0);
              }
        }
      return a
        ? parseInt((f ? '-' : '') + 60 * i[0] + i[1])
        : parseInt((f ? '-' : '') + 60 * s[0] + s[1]);
    }
  }
  function V(e, t, f) {
    let { $$slots: s = {}, $$scope: n } = t;
    j.extend(K);
    let { from: i } = t,
      { dateFormat: a } = t,
      { zone: o } = t,
      r = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        done: !1,
      };
    var c;
    return (
      z(() => {
        a || f(1, (a = 'YYYY-MM-DD H:m:s'));
        let e = j(i, a),
          t = j();
        if (o) {
          let f = F.find(({ timezone: e }) => e === o),
            s = F.find(
              ({ timezone: e }) =>
                e === Intl.DateTimeFormat().resolvedOptions().timeZone
            );
          if (f && s) {
            let n = U(e, f),
              i = U(t, s);
            (e =
              n > 0 ? e.add(n, 'minutes') : e.subtrack(Math.abs(n), 'minutes')),
              (t =
                i > 0
                  ? t.add(i, 'minutes')
                  : t.subtrack(Math.abs(i), 'minutes'));
          } else
            f ||
              console.warn(
                '[svelte-countdown] Timezone not found in database. Please use a canonical timezone from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
              ),
              s ||
                console.warn(
                  '[svelte-countdown] Intl API not supported by browser, cannot calculate timezone difference!'
                );
        } else
          console.warn(
            '[svelte-countdown] Countdown might not be precice as a timezone was not defined.'
          );
        let s = e.valueOf() - t.valueOf();
        c = setInterval(function () {
          if (s > 0) {
            let e = j.duration(s);
            f(
              0,
              (r = {
                years: e.years(),
                months: e.months(),
                weeks: e.weeks(),
                days: e.days(),
                hours: e.hours(),
                minutes: e.minutes(),
                seconds: e.seconds(),
                done: !1,
              })
            ),
              (s -= 1e3);
          } else f(0, (r = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, done: !0 })), clearInterval(c);
        }, 1e3);
      }),
      (e.$$set = (e) => {
        'from' in e && f(2, (i = e.from)),
          'dateFormat' in e && f(1, (a = e.dateFormat)),
          'zone' in e && f(3, (o = e.zone)),
          '$$scope' in e && f(4, (n = e.$$scope));
      }),
      [r, a, i, o, n, s]
    );
  }
  class q extends L {
    constructor(e) {
      super(), B(this, e, V, J, i, { from: 2, dateFormat: 1, zone: 3 });
    }
  }
  function Z(t) {
    let f;
    return {
      c() {
        (f = T('h2')),
          (f.textContent = 'LAUNCHED!'),
          d(f, 'class', 'col-start-3 text-center');
      },
      m(e, t) {
        c(e, f, t);
      },
      p: e,
      d(e) {
        e && m(f);
      },
    };
  }
  function Q(e) {
    let t,
      f,
      s,
      n,
      i,
      a,
      o,
      l,
      S,
      D,
      z,
      A,
      p,
      g,
      y,
      $,
      b,
      k,
      M,
      v,
      w,
      x,
      _,
      E,
      P,
      C,
      I,
      G = e[8].days + '',
      Y = e[8].hours + '',
      H = e[8].minutes + '',
      B = e[8].seconds + '';
    return {
      c() {
        (t = T('h5')),
          (t.textContent = 'T-'),
          (f = u()),
          (s = T('span')),
          (n = O(G)),
          (i = u()),
          (a = T('p')),
          (a.textContent = 'Days'),
          (o = u()),
          (l = T('span')),
          (l.textContent = ':'),
          (S = u()),
          (D = T('span')),
          (z = O(Y)),
          (A = u()),
          (p = T('p')),
          (p.textContent = 'Hours'),
          (g = u()),
          (y = T('span')),
          (y.textContent = ':'),
          ($ = u()),
          (b = T('span')),
          (k = O(H)),
          (M = u()),
          (v = T('p')),
          (v.textContent = 'Mins'),
          (w = u()),
          (x = T('span')),
          (x.textContent = ':'),
          (_ = u()),
          (E = T('span')),
          (P = O(B)),
          (C = u()),
          (I = T('p')),
          (I.textContent = 'Secs'),
          d(a, 'class', 'col-start-2 row-start-2 text-xs text-center'),
          d(p, 'class', 'col-start-4 row-start-2 text-xs text-center'),
          d(v, 'class', 'col-start-6 row-start-2 text-xs text-center'),
          d(I, 'class', 'col-start-8 row-start-2 text-xs text-center');
      },
      m(e, m) {
        c(e, t, m),
          c(e, f, m),
          c(e, s, m),
          r(s, n),
          c(e, i, m),
          c(e, a, m),
          c(e, o, m),
          c(e, l, m),
          c(e, S, m),
          c(e, D, m),
          r(D, z),
          c(e, A, m),
          c(e, p, m),
          c(e, g, m),
          c(e, y, m),
          c(e, $, m),
          c(e, b, m),
          r(b, k),
          c(e, M, m),
          c(e, v, m),
          c(e, w, m),
          c(e, x, m),
          c(e, _, m),
          c(e, E, m),
          r(E, P),
          c(e, C, m),
          c(e, I, m);
      },
      p(e, t) {
        256 & t && G !== (G = e[8].days + '') && h(n, G),
          256 & t && Y !== (Y = e[8].hours + '') && h(z, Y),
          256 & t && H !== (H = e[8].minutes + '') && h(k, H),
          256 & t && B !== (B = e[8].seconds + '') && h(P, B);
      },
      d(e) {
        e && m(t),
          e && m(f),
          e && m(s),
          e && m(i),
          e && m(a),
          e && m(o),
          e && m(l),
          e && m(S),
          e && m(D),
          e && m(A),
          e && m(p),
          e && m(g),
          e && m(y),
          e && m($),
          e && m(b),
          e && m(M),
          e && m(v),
          e && m(w),
          e && m(x),
          e && m(_),
          e && m(E),
          e && m(C),
          e && m(I);
      },
    };
  }
  function X(e) {
    let t;
    function f(e, t) {
      return !1 === e[8].done ? Q : Z;
    }
    let s = f(e),
      n = s(e);
    return {
      c() {
        (t = T('div')),
          n.c(),
          d(t, 'id', 'countdownTimer'),
          d(
            t,
            'class',
            'grid justify-center grid-cols-8 text-3xl text-center text-gray-800 grid-row-2'
          );
      },
      m(e, f) {
        c(e, t, f), n.m(t, null);
      },
      p(e, i) {
        s === (s = f(e)) && n
          ? n.p(e, i)
          : (n.d(1), (n = s(e)), n && (n.c(), n.m(t, null)));
      },
      d(e) {
        e && m(t), n.d();
      },
    };
  }
  function ee(e) {
    let t,
      f,
      s,
      n,
      i,
      a,
      o,
      S,
      D,
      z,
      A,
      p,
      g,
      y,
      $,
      b,
      k,
      M,
      v,
      w,
      x,
      _,
      E,
      H,
      B,
      L,
      N,
      j,
      K,
      F;
    return (
      (x = new q({
        props: {
          from: e[7],
          dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
          zone: 'Europe/Stockholm',
          $$slots: {
            default: [
              X,
              ({ remaining: e }) => ({ 8: e }),
              ({ remaining: e }) => (e ? 256 : 0),
            ],
          },
          $$scope: { ctx: e },
        },
      })),
      {
        c() {
          (t = T('div')),
            (f = T('div')),
            (s = u()),
            (n = T('div')),
            (i = T('div')),
            (a = T('h4')),
            (o = O(e[0])),
            (S = u()),
            (D = T('div')),
            (z = T('span')),
            (A = O(e[5])),
            (p = u()),
            (g = T('div')),
            (y = T('h6')),
            ($ = O(e[1])),
            (b = u()),
            (k = T('h6')),
            (M = O(e[2])),
            (v = u()),
            (w = T('div')),
            I(x.$$.fragment),
            (_ = u()),
            (E = T('div')),
            (H = T('h6')),
            (B = O(e[3])),
            (L = u()),
            (N = T('h6')),
            (j = O(e[4])),
            (K = O('hr')),
            d(f, 'class', 'w-1/3 bg-center bg-no-repeat bg-cover '),
            l(f, 'background-image', 'url(' + e[6] + ')'),
            d(a, 'id', 'name'),
            d(a, 'class', 'font-semibold text-center text-1xl'),
            d(z, 'alt', 'Rocket Status'),
            d(
              z,
              'class',
              'flex items-center justify-center h-6 p-1 text-base text-white bg-green-500 rounded-full justify-self-center'
            ),
            d(D, 'class', 'flex justify-center'),
            d(y, 'class', 'text-base text-center'),
            d(k, 'class', 'text-base text-center'),
            d(g, 'id', 'launchInformation'),
            d(g, 'class', 'mb-1'),
            d(w, 'id', 'launchTime'),
            d(H, 'class', 'text-base text-center'),
            d(N, 'id', 'timer'),
            d(N, 'class', 'text-base text-center'),
            d(E, 'id', 'date'),
            d(
              E,
              'class',
              'grid justify-center grid-cols-2 grid-rows-1 mt-3 mx-14 w-52'
            ),
            d(i, 'id', 'body'),
            d(i, 'class', 'grid justify-center grid-cols-1'),
            d(n, 'class', 'w-2/3 p-2 md:text-lg'),
            d(
              t,
              'class',
              'flex w-auto overflow-hidden bg-white rounded-lg shadow-lg h-60'
            );
        },
        m(e, m) {
          c(e, t, m),
            r(t, f),
            r(t, s),
            r(t, n),
            r(n, i),
            r(i, a),
            r(a, o),
            r(i, S),
            r(i, D),
            r(D, z),
            r(z, A),
            r(i, p),
            r(i, g),
            r(g, y),
            r(y, $),
            r(g, b),
            r(g, k),
            r(k, M),
            r(i, v),
            r(i, w),
            G(x, w, null),
            r(i, _),
            r(i, E),
            r(E, H),
            r(H, B),
            r(E, L),
            r(E, N),
            r(N, j),
            r(N, K),
            (F = !0);
        },
        p(e, [t]) {
          (!F || 64 & t) && l(f, 'background-image', 'url(' + e[6] + ')'),
            (!F || 1 & t) && h(o, e[0]),
            (!F || 32 & t) && h(A, e[5]),
            (!F || 2 & t) && h($, e[1]),
            (!F || 4 & t) && h(M, e[2]);
          const s = {};
          128 & t && (s.from = e[7]),
            768 & t && (s.$$scope = { dirty: t, ctx: e }),
            x.$set(s),
            (!F || 8 & t) && h(B, e[3]),
            (!F || 16 & t) && h(j, e[4]);
        },
        i(e) {
          F || (P(x.$$.fragment, e), (F = !0));
        },
        o(e) {
          C(x.$$.fragment, e), (F = !1);
        },
        d(e) {
          e && m(t), Y(x);
        },
      }
    );
  }
  function te(e, t, f) {
    let { launchTitle: s } = t,
      { organization: n } = t,
      { launchPadLocation: i } = t,
      { date: a } = t,
      { time: o } = t,
      { rocketStatus: r } = t,
      { rocketImage: c } = t,
      { eventTime: m } = t;
    return (
      (e.$$set = (e) => {
        'launchTitle' in e && f(0, (s = e.launchTitle)),
          'organization' in e && f(1, (n = e.organization)),
          'launchPadLocation' in e && f(2, (i = e.launchPadLocation)),
          'date' in e && f(3, (a = e.date)),
          'time' in e && f(4, (o = e.time)),
          'rocketStatus' in e && f(5, (r = e.rocketStatus)),
          'rocketImage' in e && f(6, (c = e.rocketImage)),
          'eventTime' in e && f(7, (m = e.eventTime));
      }),
      [s, n, i, a, o, r, c, m]
    );
  }
  class fe extends L {
    constructor(e) {
      super(),
        B(this, e, te, ee, i, {
          launchTitle: 0,
          organization: 1,
          launchPadLocation: 2,
          date: 3,
          time: 4,
          rocketStatus: 5,
          rocketImage: 6,
          eventTime: 7,
        });
    }
  }
  function se(t) {
    let f;
    return {
      c() {
        (f = T('nav')),
          (f.innerHTML =
            '<div class="mb-2 sm:mb-0"><h4 class="text-6xl font-bold text-center no-underline text-grey-darkest hover:text-blue-dark">🚀 Upcoming Rocket Launches</h4></div>'),
          d(
            f,
            'class',
            'flex flex-col w-full px-6 py-4 text-black sm:flex-row sm:text-left sm:justify-between sm:items-baseline'
          );
      },
      m(e, t) {
        c(e, f, t);
      },
      p: e,
      i: e,
      o: e,
      d(e) {
        e && m(f);
      },
    };
  }
  class ne extends L {
    constructor(e) {
      super(), B(this, e, null, se, i, {});
    }
  }
  function ie(t) {
    let f;
    return {
      c() {
        (f = T('footer')),
          (f.innerHTML =
            '<div class="container flex flex-col flex-wrap items-center justify-between mx-auto"><div class="flex mx-auto text-center text-white">Made with Love by Alestry Perez 2021</div></div>'),
          d(f, 'class', 'w-full p-4 text-center bg-gray-900 pin-b');
      },
      m(e, t) {
        c(e, f, t);
      },
      p: e,
      i: e,
      o: e,
      d(e) {
        e && m(f);
      },
    };
  }
  class ae extends L {
    constructor(e) {
      super(), B(this, e, null, ie, i, {});
    }
  }
  const oe = (e) =>
      new Date(e).toLocaleDateString({
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    re = (e) =>
      new Date(e).toLocaleTimeString('en-IN', {
        hour12: !1,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
  function ce(e, t, f) {
    const s = e.slice();
    return (
      (s[1] = t[f].name),
      (s[2] = t[f].image),
      (s[3] = t[f].pad),
      (s[4] = t[f].net),
      (s[5] = t[f].launch_service_provider),
      (s[6] = t[f].status),
      s
    );
  }
  function me(e) {
    let t, f;
    return (
      (t = new fe({
        props: {
          rocketImage: e[2],
          launchTitle: e[1],
          rocketStatus: e[6].abbrev,
          organization: e[5].name,
          launchPadLocation: e[3].name,
          eventTime: e[4],
          date: oe(e[4]),
          time: re(e[4]),
        },
      })),
      {
        c() {
          I(t.$$.fragment);
        },
        m(e, s) {
          G(t, e, s), (f = !0);
        },
        p(e, f) {
          const s = {};
          1 & f && (s.rocketImage = e[2]),
            1 & f && (s.launchTitle = e[1]),
            1 & f && (s.rocketStatus = e[6].abbrev),
            1 & f && (s.organization = e[5].name),
            1 & f && (s.launchPadLocation = e[3].name),
            1 & f && (s.eventTime = e[4]),
            1 & f && (s.date = oe(e[4])),
            1 & f && (s.time = re(e[4])),
            t.$set(s);
        },
        i(e) {
          f || (P(t.$$.fragment, e), (f = !0));
        },
        o(e) {
          C(t.$$.fragment, e), (f = !1);
        },
        d(e) {
          Y(t, e);
        },
      }
    );
  }
  function Te(e) {
    let t, f, n, i, a, o;
    t = new ne({});
    let r = e[0],
      O = [];
    for (let t = 0; t < r.length; t += 1) O[t] = me(ce(e, r, t));
    const h = (e) =>
      C(O[e], 1, 1, () => {
        O[e] = null;
      });
    return (
      (a = new ae({})),
      {
        c() {
          I(t.$$.fragment), (f = u()), (n = T('div'));
          for (let e = 0; e < O.length; e += 1) O[e].c();
          (i = u()),
            I(a.$$.fragment),
            d(n, 'class', 'grid h-auto grid-cols-3 gap-2 pt-5 pb-5');
        },
        m(e, s) {
          G(t, e, s), c(e, f, s), c(e, n, s);
          for (let e = 0; e < O.length; e += 1) O[e].m(n, null);
          c(e, i, s), G(a, e, s), (o = !0);
        },
        p(e, [t]) {
          if (1 & t) {
            let f;
            for (r = e[0], f = 0; f < r.length; f += 1) {
              const s = ce(e, r, f);
              O[f]
                ? (O[f].p(s, t), P(O[f], 1))
                : ((O[f] = me(s)), O[f].c(), P(O[f], 1), O[f].m(n, null));
            }
            for (E = { r: 0, c: [], p: E }, f = r.length; f < O.length; f += 1)
              h(f);
            E.r || s(E.c), (E = E.p);
          }
        },
        i(e) {
          if (!o) {
            P(t.$$.fragment, e);
            for (let e = 0; e < r.length; e += 1) P(O[e]);
            P(a.$$.fragment, e), (o = !0);
          }
        },
        o(e) {
          C(t.$$.fragment, e), (O = O.filter(Boolean));
          for (let e = 0; e < O.length; e += 1) C(O[e]);
          C(a.$$.fragment, e), (o = !1);
        },
        d(e) {
          Y(t, e),
            e && m(f),
            e && m(n),
            (function (e, t) {
              for (let f = 0; f < e.length; f += 1) e[f] && e[f].d(t);
            })(O, e),
            e && m(i),
            Y(a, e);
        },
      }
    );
  }
  function Oe(e, t, f) {
    let s = [];
    return (
      z(async () => {
        f(
          0,
          (s = await (async () => {
            try {
              const e = await fetch(
                'https://ll.thespacedevs.com/2.2.0/launch/upcoming/'
              );
              if (e.ok) return (await e.json()).results;
            } catch (e) {
              console.log(`Uh,oh! ${e}`);
            }
          })())
        );
      }),
      [s]
    );
  }
  return new (class extends L {
    constructor(e) {
      super(), B(this, e, Oe, Te, i, {});
    }
  })({ target: document.body, props: {} });
})();
//# sourceMappingURL=bundle.js.map
