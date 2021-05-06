
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",f="date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,c=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},$=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},l={s:$,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+$(r,2,"0")+":"+$(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,u),s=n-i<0,a=e.clone().add(r+(s?-1:1),u);return +(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,D:f,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},y="en",M={};M[y]=d;var m=function(t){return t instanceof S},D=function(t,e,n){var r;if(!t)return y;if("string"==typeof t)M[t]&&(r=t),e&&(M[t]=e,r=t);else {var i=t.name;M[i]=t,r=i;}return !n&&r&&(y=r),r||!n&&y},v=function(t,e){if(m(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},g=l;g.l=D,g.i=m,g.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function d(t){this.$L=D(t.locale,null,!0),this.parse(t);}var $=d.prototype;return $.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},$.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},$.$utils=function(){return g},$.isValid=function(){return !("Invalid Date"===this.$d.toString())},$.isSame=function(t,e){var n=v(t);return this.startOf(e)<=n&&n<=this.endOf(e)},$.isAfter=function(t,e){return v(t)<this.startOf(e)},$.isBefore=function(t,e){return this.endOf(e)<v(t)},$.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},$.unix=function(){return Math.floor(this.valueOf()/1e3)},$.valueOf=function(){return this.$d.getTime()},$.startOf=function(t,a){var h=this,c=!!g.u(a)||a,d=g.p(t),$=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return c?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},y=this.$W,M=this.$M,m=this.$D,D="set"+(this.$u?"UTC":"");switch(d){case o:return c?$(1,0):$(31,11);case u:return c?$(1,M):$(0,M+1);case s:var v=this.$locale().weekStart||0,S=(y<v?y+7:y)-v;return $(c?m-S:m+(6-S),M);case i:case f:return l(D+"Hours",0);case r:return l(D+"Minutes",1);case n:return l(D+"Seconds",2);case e:return l(D+"Milliseconds",3);default:return this.clone()}},$.endOf=function(t){return this.startOf(t,!1)},$.$set=function(s,a){var h,c=g.p(s),d="set"+(this.$u?"UTC":""),$=(h={},h[i]=d+"Date",h[f]=d+"Date",h[u]=d+"Month",h[o]=d+"FullYear",h[r]=d+"Hours",h[n]=d+"Minutes",h[e]=d+"Seconds",h[t]=d+"Milliseconds",h)[c],l=c===i?this.$D+(a-this.$W):a;if(c===u||c===o){var y=this.clone().set(f,1);y.$d[$](l),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},$.set=function(t,e){return this.clone().$set(t,e)},$.get=function(t){return this[g.p(t)]()},$.add=function(t,a){var f,h=this;t=Number(t);var c=g.p(a),d=function(e){var n=v(h);return g.w(n.date(n.date()+Math.round(e*t)),h)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(f={},f[n]=6e4,f[r]=36e5,f[e]=1e3,f)[c]||1,l=this.$d.getTime()+t*$;return g.w(l,this)},$.subtract=function(t,e){return this.add(-1*t,e)},$.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,f=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:h(i.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(c,function(t,e){return e||l[t]||r.replace(":","")})},$.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},$.diff=function(t,f,h){var c,d=g.p(f),$=v(t),l=6e4*($.utcOffset()-this.utcOffset()),y=this-$,M=g.m(this,$);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(y-l)/6048e5,c[i]=(y-l)/864e5,c[r]=y/36e5,c[n]=y/6e4,c[e]=y/1e3,c)[d]||y,h?M:g.a(M)},$.daysInMonth=function(){return this.endOf(u).$D},$.$locale=function(){return M[this.$L]},$.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},$.clone=function(){return g.w(this.$d,this)},$.toDate=function(){return new Date(this.valueOf())},$.toJSON=function(){return this.isValid()?this.toISOString():null},$.toISOString=function(){return this.$d.toISOString()},$.toString=function(){return this.$d.toUTCString()},d}(),p=S.prototype;return v.prototype=p,[["$ms",t],["$s",e],["$m",n],["$H",r],["$W",i],["$M",u],["$y",o],["$D",f]].forEach(function(t){p[t[1]]=function(e){return this.$g(e,t[0],t[1])};}),v.extend=function(t,e){return t.$i||(t(e,S,v),t.$i=!0),v},v.locale=D,v.isDayjs=m,v.unix=function(t){return v(1e3*t)},v.en=M[y],v.Ls=M,v.p={},v});
    });

    var duration = createCommonjsModule(function (module, exports) {
    !function(t,s){module.exports=s();}(commonjsGlobal,function(){var t,s,n=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,i=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,e={years:31536e6,months:2592e6,days:864e5,hours:36e5,minutes:6e4,seconds:1e3,milliseconds:1,weeks:6048e5},r=function(t){return t instanceof c},o=function(t,s,n){return new c(t,n,s.$l)},u=function(t){return s.p(t)+"s"},h=function(t){return t<0},a=function(t){return h(t)?Math.ceil(t):Math.floor(t)},d=function(t,s){return t?h(t)?{negative:!0,format:""+function(t){return Math.abs(t)}(t)+s}:{negative:!1,format:""+t+s}:{negative:!1,format:""}},c=function(){function h(t,s,n){var r=this;if(this.$d={},this.$l=n,s)return o(t*e[u(s)],this);if("number"==typeof t)return this.$ms=t,this.parseFromMilliseconds(),this;if("object"==typeof t)return Object.keys(t).forEach(function(s){r.$d[u(s)]=t[s];}),this.calMilliseconds(),this;if("string"==typeof t){var h=t.match(i);if(h)return this.$d.years=h[2],this.$d.months=h[3],this.$d.weeks=h[4],this.$d.days=h[5],this.$d.hours=h[6],this.$d.minutes=h[7],this.$d.seconds=h[8],this.calMilliseconds(),this}return this}var c=h.prototype;return c.calMilliseconds=function(){var t=this;this.$ms=Object.keys(this.$d).reduce(function(s,n){return s+(t.$d[n]||0)*e[n]},0);},c.parseFromMilliseconds=function(){var t=this.$ms;this.$d.years=a(t/31536e6),t%=31536e6,this.$d.months=a(t/2592e6),t%=2592e6,this.$d.days=a(t/864e5),t%=864e5,this.$d.hours=a(t/36e5),t%=36e5,this.$d.minutes=a(t/6e4),t%=6e4,this.$d.seconds=a(t/1e3),t%=1e3,this.$d.milliseconds=t;},c.toISOString=function(){var t=d(this.$d.years,"Y"),s=d(this.$d.months,"M"),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var i=d(n,"D"),e=d(this.$d.hours,"H"),r=d(this.$d.minutes,"M"),o=this.$d.seconds||0;this.$d.milliseconds&&(o+=this.$d.milliseconds/1e3);var u=d(o,"S"),h=t.negative||s.negative||i.negative||e.negative||r.negative||u.negative,a=e.format||r.format||u.format?"T":"",c=(h?"-":"")+"P"+t.format+s.format+i.format+a+e.format+r.format+u.format;return "P"===c||"-P"===c?"P0D":c},c.toJSON=function(){return this.toISOString()},c.format=function(t){var i=t||"YYYY-MM-DDTHH:mm:ss",e={Y:this.$d.years,YY:s.s(this.$d.years,2,"0"),YYYY:s.s(this.$d.years,4,"0"),M:this.$d.months,MM:s.s(this.$d.months,2,"0"),D:this.$d.days,DD:s.s(this.$d.days,2,"0"),H:this.$d.hours,HH:s.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:s.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:s.s(this.$d.seconds,2,"0"),SSS:s.s(this.$d.milliseconds,3,"0")};return i.replace(n,function(t,s){return s||String(e[t])})},c.as=function(t){return this.$ms/e[u(t)]},c.get=function(t){var s=this.$ms,n=u(t);return "milliseconds"===n?s%=1e3:s="weeks"===n?a(s/e[n]):this.$d[n],0===s?0:s},c.add=function(t,s,n){var i;return i=s?t*e[u(s)]:r(t)?t.$ms:o(t,this).$ms,o(this.$ms+i*(n?-1:1),this)},c.subtract=function(t,s){return this.add(t,s,!0)},c.locale=function(t){var s=this.clone();return s.$l=t,s},c.clone=function(){return o(this.$ms,this)},c.humanize=function(s){return t().add(this.$ms,"ms").locale(this.$l).fromNow(!s)},c.milliseconds=function(){return this.get("milliseconds")},c.asMilliseconds=function(){return this.as("milliseconds")},c.seconds=function(){return this.get("seconds")},c.asSeconds=function(){return this.as("seconds")},c.minutes=function(){return this.get("minutes")},c.asMinutes=function(){return this.as("minutes")},c.hours=function(){return this.get("hours")},c.asHours=function(){return this.as("hours")},c.days=function(){return this.get("days")},c.asDays=function(){return this.as("days")},c.weeks=function(){return this.get("weeks")},c.asWeeks=function(){return this.as("weeks")},c.months=function(){return this.get("months")},c.asMonths=function(){return this.as("months")},c.years=function(){return this.get("years")},c.asYears=function(){return this.as("years")},h}();return function(n,i,e){t=e,s=e().$utils(),e.duration=function(t,s){var n=e.locale();return o(t,{$l:n},s)},e.isDuration=r;var u=i.prototype.add,h=i.prototype.subtract;i.prototype.add=function(t,s){return r(t)&&(t=t.asMilliseconds()),u.bind(this)(t,s)},i.prototype.subtract=function(t,s){return r(t)&&(t=t.asMilliseconds()),h.bind(this)(t,s)};}});
    });

    const database = [{
            "Timezone": "Africa/Abidjan",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Accra",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Algiers",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Bissau",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Cairo",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Casablanca",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Ceuta",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/El_Aaiun",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Johannesburg",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Juba",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Africa/Khartoum",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Lagos",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Maputo",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Monrovia",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Nairobi",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Africa/Ndjamena",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Tripoli",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Tunis",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Windhoek",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "America/Adak",
            "Offset": "-10:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "America/Anchorage",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Araguaina",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Buenos_Aires",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Catamarca",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Cordoba",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Jujuy",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/La_Rioja",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Mendoza",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Rio_Gallegos",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Salta",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/San_Juan",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/San_Luis",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Tucuman",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Ushuaia",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Asuncion",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Atikokan",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Bahia",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Bahia_Banderas",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Barbados",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Belem",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Belize",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Blanc-Sablon",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Boa_Vista",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Bogota",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Boise",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Cambridge_Bay",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Campo_Grande",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Cancun",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Caracas",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Cayenne",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Chicago",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Chihuahua",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Costa_Rica",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Creston",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Cuiaba",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Curacao",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Danmarkshavn",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "America/Dawson",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Dawson_Creek",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Denver",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Detroit",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Edmonton",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Eirunepe",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/El_Salvador",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Fort_Nelson",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Fortaleza",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Glace_Bay",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Godthab",
            "Offset": "-03:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/Goose_Bay",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Grand_Turk",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Guatemala",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Guayaquil",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Guyana",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Halifax",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Havana",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Hermosillo",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Indiana/Indianapolis",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Knox",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Indiana/Marengo",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Petersburg",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Tell_City",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Indiana/Vevay",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Vincennes",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Winamac",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Inuvik",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Iqaluit",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Jamaica",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Juneau",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Kentucky/Louisville",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Kentucky/Monticello",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/La_Paz",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Lima",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Los_Angeles",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Maceio",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Managua",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Manaus",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Martinique",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Matamoros",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Mazatlan",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Menominee",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Merida",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Metlakatla",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Mexico_City",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Miquelon",
            "Offset": "-03:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/Moncton",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Monterrey",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Montevideo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Nassau",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/New_York",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Nipigon",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Nome",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Noronha",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/North_Dakota/Beulah",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/North_Dakota/Center",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/North_Dakota/New_Salem",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Ojinaga",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Panama",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Pangnirtung",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Paramaribo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Phoenix",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Port_of_Spain",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Port-au-Prince",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Porto_Velho",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Puerto_Rico",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Punta_Arenas",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Rainy_River",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Rankin_Inlet",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Recife",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Regina",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Resolute",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Rio_Branco",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Santarem",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Santiago",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Santo_Domingo",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Sao_Paulo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Scoresbysund",
            "Offset": "-01:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "America/Sitka",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/St_Johns",
            "Offset": "-03:30",
            "DST Offset": "-02:30"
        },
        {
            "Timezone": "America/Swift_Current",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Tegucigalpa",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Thule",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Thunder_Bay",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Tijuana",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Toronto",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Vancouver",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Whitehorse",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Winnipeg",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Yakutat",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Yellowknife",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Antarctica/Casey",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Antarctica/Davis",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Antarctica/DumontDUrville",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Antarctica/Macquarie",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Antarctica/Mawson",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Antarctica/Palmer",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Antarctica/Rothera",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Antarctica/Syowa",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Antarctica/Troll",
            "Offset": "+00:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Antarctica/Vostok",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Almaty",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Amman",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Anadyr",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Asia/Aqtau",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Aqtobe",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Ashgabat",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Atyrau",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Baghdad",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Baku",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Bangkok",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Barnaul",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Beirut",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Bishkek",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Brunei",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Chita",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Choibalsan",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Colombo",
            "Offset": "+05:30",
            "DST Offset": "+05:30"
        },
        {
            "Timezone": "Asia/Damascus",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Dhaka",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Dili",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Dubai",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Dushanbe",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Famagusta",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Asia/Gaza",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Hebron",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Ho_Chi_Minh",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Hong_Kong",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Hovd",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Irkutsk",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Jakarta",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Jayapura",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Jerusalem",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Kabul",
            "Offset": "+04:30",
            "DST Offset": "+04:30"
        },
        {
            "Timezone": "Asia/Kamchatka",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Asia/Karachi",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Kathmandu",
            "Offset": "+05:45",
            "DST Offset": "+05:45"
        },
        {
            "Timezone": "Asia/Khandyga",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Kolkata",
            "Offset": "+05:30",
            "DST Offset": "+05:30"
        },
        {
            "Timezone": "Asia/Krasnoyarsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Kuala_Lumpur",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Kuching",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Macau",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Magadan",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Makassar",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Manila",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Novokuznetsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Novosibirsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Omsk",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Oral",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Pontianak",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Pyongyang",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Qatar",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Qyzylorda",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Riyadh",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Sakhalin",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Samarkand",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Seoul",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Shanghai",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Singapore",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Srednekolymsk",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Taipei",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Tashkent",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Tbilisi",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Tehran",
            "Offset": "+03:30",
            "DST Offset": "+04:30"
        },
        {
            "Timezone": "Asia/Thimphu",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Tokyo",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Tomsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Ulaanbaatar",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Urumqi",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Ust-Nera",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Asia/Vladivostok",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Asia/Yakutsk",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Yangon",
            "Offset": "+06:30",
            "DST Offset": "+06:30"
        },
        {
            "Timezone": "Asia/Yekaterinburg",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Yerevan",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Atlantic/Azores",
            "Offset": "-01:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Atlantic/Bermuda",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Atlantic/Canary",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Cape_Verde",
            "Offset": "-01:00",
            "DST Offset": "-01:00"
        },
        {
            "Timezone": "Atlantic/Faroe",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Madeira",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Reykjavik",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Atlantic/South_Georgia",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "Atlantic/Stanley",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Australia/Adelaide",
            "Offset": "+09:30",
            "DST Offset": "+10:30"
        },
        {
            "Timezone": "Australia/Brisbane",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Australia/Broken_Hill",
            "Offset": "+09:30",
            "DST Offset": "+10:30"
        },
        {
            "Timezone": "Australia/Currie",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Darwin",
            "Offset": "+09:30",
            "DST Offset": "+09:30"
        },
        {
            "Timezone": "Australia/Eucla",
            "Offset": "+08:45",
            "DST Offset": "+08:45"
        },
        {
            "Timezone": "Australia/Hobart",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Lindeman",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Australia/Lord_Howe",
            "Offset": "+10:30",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Melbourne",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Perth",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Australia/Sydney",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Etc/GMT",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Etc/GMT+1",
            "Offset": "-01:00",
            "DST Offset": "-01:00"
        },
        {
            "Timezone": "Etc/GMT+10",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Etc/GMT+11",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Etc/GMT+12",
            "Offset": "-12:00",
            "DST Offset": "-12:00"
        },
        {
            "Timezone": "Etc/GMT+2",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "Etc/GMT+3",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Etc/GMT+4",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "Etc/GMT+5",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "Etc/GMT+6",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Etc/GMT+7",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "Etc/GMT+8",
            "Offset": "-08:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "Etc/GMT+9",
            "Offset": "-09:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "Etc/GMT-1",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Etc/GMT-10",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Etc/GMT-11",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Etc/GMT-12",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Etc/GMT-13",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Etc/GMT-14",
            "Offset": "+14:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Etc/GMT-2",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Etc/GMT-3",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Etc/GMT-4",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Etc/GMT-5",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Etc/GMT-6",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Etc/GMT-7",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Etc/GMT-8",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Etc/GMT-9",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Etc/UTC",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Europe/Amsterdam",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Andorra",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Astrakhan",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Athens",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Belgrade",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Berlin",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Brussels",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Bucharest",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Budapest",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Chisinau",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Copenhagen",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Dublin",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/Gibraltar",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Helsinki",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Istanbul",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Kaliningrad",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Kiev",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Kirov",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Lisbon",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/London",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/Luxembourg",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Madrid",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Malta",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Minsk",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Monaco",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Moscow",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Nicosia",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Oslo",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Paris",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Prague",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Riga",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Rome",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Samara",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Saratov",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Simferopol",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Sofia",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Stockholm",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Tallinn",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Tirane",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Ulyanovsk",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Uzhgorod",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Vienna",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Vilnius",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Volgograd",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Warsaw",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Zaporozhye",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Zurich",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Indian/Chagos",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Indian/Christmas",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Indian/Cocos",
            "Offset": "+06:30",
            "DST Offset": "+06:30"
        },
        {
            "Timezone": "Indian/Kerguelen",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Indian/Mahe",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Indian/Maldives",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Indian/Mauritius",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Indian/Reunion",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Pacific/Apia",
            "Offset": "+13:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Auckland",
            "Offset": "+12:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Bougainville",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Chatham",
            "Offset": "+12:45",
            "DST Offset": "+13:45"
        },
        {
            "Timezone": "Pacific/Chuuk",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Easter",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "Pacific/Efate",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Enderbury",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Fakaofo",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Fiji",
            "Offset": "+12:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Funafuti",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Galapagos",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Pacific/Gambier",
            "Offset": "-09:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "Pacific/Guadalcanal",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Guam",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Honolulu",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Kiritimati",
            "Offset": "+14:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Kosrae",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Kwajalein",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Majuro",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Marquesas",
            "Offset": "-09:30",
            "DST Offset": "-09:30"
        },
        {
            "Timezone": "Pacific/Nauru",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Niue",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Pacific/Norfolk",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Noumea",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Pago_Pago",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Pacific/Palau",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Pacific/Pitcairn",
            "Offset": "-08:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "Pacific/Pohnpei",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Port_Moresby",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Rarotonga",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Tahiti",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Tarawa",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Tongatapu",
            "Offset": "+13:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Wake",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Wallis",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        }
    ];

    /* node_modules/.pnpm/svelte-countdown@1.0.0/node_modules/svelte-countdown/src/Countdown.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const get_default_slot_changes = dirty => ({ remaining: dirty & /*remaining*/ 1 });
    const get_default_slot_context = ctx => ({ remaining: /*remaining*/ ctx[0] });

    function create_fragment$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, remaining*/ 17) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function UTCdiff(date, tz) {
    	let isMinus = tz["Offset"].charAt(0) == "-";

    	let st = tz["Offset"].split(":").map(function (item) {
    		return parseInt(item);
    	});

    	if (tz["Offset"] == tz["DST Offset"]) {
    		// no DST
    		if (st[0] === 0 && st[1] === 0) return 0; // no diff

    		return parseInt((isMinus ? "-" : "") + st[0] * 60 + st[1]); // return UTC diff in minutes
    	} else {
    		// calc DST
    		let dst = tz["DST Offset"].split(":").map(function (item) {
    			return parseInt(item);
    		});

    		let isDST = false;
    		let tmpDate;

    		if (tz["Timezone"].indexOf("Europe") === 0) {
    			switch (true) {
    				case date.month() > 2 && date.month() < 9:
    					isDST = true;
    					break;
    				case date.month() == 2:
    					tmpDate = date.endOf("month");
    					while (tmpDate.day() != 0) {
    						tmpDate = tmpDate.subtrack(1, "day");
    					}
    					if (date.date() == tmpDate.date()) {
    						if (date.hour() > st[0] + 1) isDST = true;
    					} else {
    						if (date.date() > tmpDate.date()) isDST = true;
    					}
    					break;
    				case date.month() == 9:
    					tmpDate = date.endOf("month");
    					while (tmpDate.day() != 0) {
    						tmpDate = tmpDate.subtrack(1, "day");
    					}
    					if (date.date() == tmpDate.date()) {
    						if (date.hour() < st[0] + 1) isDST = true;
    					} else {
    						if (date.date() < tmpDate.date()) isDST = true;
    					}
    					break;
    			}
    		} else {
    			switch (tz["Timezone"]) {
    				case "America/Havana":
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							tmpDate.add(14, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "America/Mexico_City":
    					switch (true) {
    						case date.month() > 3 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 3:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "America/Campo_Grande":
    				case "America/Cuiaba":
    					switch (true) {
    						case date.month() > 9 || date.month() < 1:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							tmpDate.add(14, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 1:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							tmpDate.add(14, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "America/Santiago":
    				case "Pacific/Easter":
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							if (date.date() == 11) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > 11) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							if (date.date() == 29) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < 29) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "America/Asuncion":
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							tmpDate.add(14, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							tmpDate.add(7, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Africa/Cairo":
    					switch (true) {
    						case date.month() > 3 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 3:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 5) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 4) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Asia/Jerusalem":
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							tmpDate.subtrack(2, "day");
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Asia/Amman":
    					switch (true) {
    						case date.month() > 2 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 5) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Asia/Beirut":
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Asia/Damascus":
    					switch (true) {
    						case date.month() > 2 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							if (date.date() == 30) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > 30) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							if (date.date() == 21) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < 21) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Australia/Tasmania":
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Pacific/Auckland":
    				case "Pacific/Chatham":
    					switch (true) {
    						case date.month() > 8 || date.month() < 3:
    							isDST = true;
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 3:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case "Pacific/Tongatapu":
    					switch (true) {
    						case date.month() > 10:
    							isDST = true;
    							break;
    						case date.month() == 10:
    							tmpDate = date.startOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 0:
    							tmpDate = date.endOf("month");
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, "day");
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				default:
    					if (tz["Timezone"].indexOf("Australia") === 0) {
    						// Had to keep apart from Tasmania
    						switch (true) {
    							case date.month() > 9 || date.month() < 3:
    								isDST = true;
    								break;
    							case date.month() == 9:
    								tmpDate = date.startOf("month");
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, "day");
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() > 2) isDST = true;
    								} else {
    									if (date.date() > tmpDate.date()) isDST = true;
    								}
    								break;
    							case date.month() == 3:
    								tmpDate = date.startOf("month");
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, "day");
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() < 2) isDST = true;
    								} else {
    									if (date.date() < tmpDate.date()) isDST = true;
    								}
    								break;
    						}
    					} else {
    						// USA / Canada & rest of the world... (sorry)
    						switch (true) {
    							case date.month() > 2 && date.month() < 10:
    								isDST = true;
    								break;
    							case date.month() == 2:
    								tmpDate = date.startOf("month");
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, "day");
    								}
    								tmpDate.add(7, "day");
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() > 2) isDST = true;
    								} else {
    									if (date.date() > tmpDate.date()) isDST = true;
    								}
    								break;
    							case date.month() == 10:
    								tmpDate = date.startOf("month");
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, "day");
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() < 2) isDST = true;
    								} else {
    									if (date.date() < tmpDate.date()) isDST = true;
    								}
    								break;
    						}
    					}
    					break;
    			}
    		}

    		return isDST
    		? parseInt((isMinus ? "-" : "") + dst[0] * 60 + dst[1])
    		: parseInt((isMinus ? "-" : "") + st[0] * 60 + st[1]);

    		
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Countdown", slots, ['default']);
    	dayjs_min.extend(duration);
    	let { from } = $$props, { dateFormat } = $$props, { zone } = $$props;

    	let remaining = {
    		years: 0,
    		months: 0,
    		weeks: 0,
    		days: 0,
    		hours: 0,
    		minutes: 0,
    		seconds: 0,
    		done: false
    	};

    	let r = 0;
    	var timer;

    	onMount(() => {
    		if (!dateFormat) {
    			$$invalidate(1, dateFormat = "YYYY-MM-DD H:m:s");
    		}

    		let target = dayjs_min(from, dateFormat);
    		let local = dayjs_min();

    		if (zone) {
    			let remoteTZ = database.find(({ timezone }) => timezone === zone);
    			let localTZ = database.find(({ timezone }) => timezone === Intl.DateTimeFormat().resolvedOptions().timeZone);

    			if (remoteTZ && localTZ) {
    				// calc UTC + DST diff
    				let remoteDiff = UTCdiff(target, remoteTZ);

    				let localDiff = UTCdiff(local, localTZ);

    				target = remoteDiff > 0
    				? target.add(remoteDiff, "minutes")
    				: target.subtrack(Math.abs(remoteDiff), "minutes");

    				local = localDiff > 0
    				? local.add(localDiff, "minutes")
    				: local.subtrack(Math.abs(localDiff), "minutes");
    			} else {
    				if (!remoteTZ) console.warn("[svelte-countdown] Timezone not found in database. Please use a canonical timezone from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones");
    				if (!localTZ) console.warn("[svelte-countdown] Intl API not supported by browser, cannot calculate timezone difference!");
    			}
    		} else {
    			console.warn("[svelte-countdown] Countdown might not be precice as a timezone was not defined.");
    		}

    		let diff = target.valueOf() - local.valueOf();

    		timer = setInterval(
    			function () {
    				if (diff > 0) {
    					let r = dayjs_min.duration(diff);

    					$$invalidate(0, remaining = {
    						years: r.years(),
    						months: r.months(),
    						weeks: r.weeks(),
    						days: r.days(),
    						hours: r.hours(),
    						minutes: r.minutes(),
    						seconds: r.seconds(),
    						done: false
    					});

    					diff -= 1000;
    				} else {
    					$$invalidate(0, remaining = {
    						years: 0,
    						months: 0,
    						weeks: 0,
    						days: 0,
    						hours: 0,
    						minutes: 0,
    						seconds: 0,
    						done: true
    					});

    					clearInterval(timer);
    				}
    			},
    			1000
    		);
    	});

    	const writable_props = ["from", "dateFormat", "zone"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Countdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("from" in $$props) $$invalidate(2, from = $$props.from);
    		if ("dateFormat" in $$props) $$invalidate(1, dateFormat = $$props.dateFormat);
    		if ("zone" in $$props) $$invalidate(3, zone = $$props.zone);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		dayjs: dayjs_min,
    		duration,
    		database,
    		from,
    		dateFormat,
    		zone,
    		remaining,
    		r,
    		timer,
    		UTCdiff
    	});

    	$$self.$inject_state = $$props => {
    		if ("from" in $$props) $$invalidate(2, from = $$props.from);
    		if ("dateFormat" in $$props) $$invalidate(1, dateFormat = $$props.dateFormat);
    		if ("zone" in $$props) $$invalidate(3, zone = $$props.zone);
    		if ("remaining" in $$props) $$invalidate(0, remaining = $$props.remaining);
    		if ("r" in $$props) r = $$props.r;
    		if ("timer" in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [remaining, dateFormat, from, zone, $$scope, slots];
    }

    class Countdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { from: 2, dateFormat: 1, zone: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countdown",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*from*/ ctx[2] === undefined && !("from" in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'from'");
    		}

    		if (/*dateFormat*/ ctx[1] === undefined && !("dateFormat" in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'dateFormat'");
    		}

    		if (/*zone*/ ctx[3] === undefined && !("zone" in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'zone'");
    		}
    	}

    	get from() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set from(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateFormat() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateFormat(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zone() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zone(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Card.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/Card.svelte";

    // (50:18) {:else}
    function create_else_block(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "LAUNCHED!";
    			attr_dev(h2, "class", "col-start-3 text-center");
    			add_location(h2, file$3, 50, 18, 2206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(50:18) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:18) {#if remaining.done === false}
    function create_if_block(ctx) {
    	let h5;
    	let t1;
    	let span0;
    	let t2_value = /*remaining*/ ctx[8].days + "";
    	let t2;
    	let t3;
    	let p0;
    	let t5;
    	let span1;
    	let t7;
    	let span2;
    	let t8_value = /*remaining*/ ctx[8].hours + "";
    	let t8;
    	let t9;
    	let p1;
    	let t11;
    	let span3;
    	let t13;
    	let span4;
    	let t14_value = /*remaining*/ ctx[8].minutes + "";
    	let t14;
    	let t15;
    	let p2;
    	let t17;
    	let span5;
    	let t19;
    	let span6;
    	let t20_value = /*remaining*/ ctx[8].seconds + "";
    	let t20;
    	let t21;
    	let p3;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "T-";
    			t1 = space();
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Days";
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = ":";
    			t7 = space();
    			span2 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "Hours";
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = ":";
    			t13 = space();
    			span4 = element("span");
    			t14 = text(t14_value);
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "Mins";
    			t17 = space();
    			span5 = element("span");
    			span5.textContent = ":";
    			t19 = space();
    			span6 = element("span");
    			t20 = text(t20_value);
    			t21 = space();
    			p3 = element("p");
    			p3.textContent = "Secs";
    			add_location(h5, file$3, 37, 18, 1517);
    			add_location(span0, file$3, 38, 18, 1547);
    			attr_dev(p0, "class", "col-start-2 row-start-2 text-xs text-center");
    			add_location(p0, file$3, 39, 18, 1595);
    			add_location(span1, file$3, 40, 18, 1677);
    			add_location(span2, file$3, 41, 18, 1712);
    			attr_dev(p1, "class", "col-start-4 row-start-2 text-xs text-center");
    			add_location(p1, file$3, 42, 18, 1761);
    			add_location(span3, file$3, 43, 18, 1844);
    			add_location(span4, file$3, 44, 18, 1879);
    			attr_dev(p2, "class", "col-start-6 row-start-2 text-xs text-center");
    			add_location(p2, file$3, 45, 18, 1930);
    			add_location(span5, file$3, 46, 18, 2012);
    			add_location(span6, file$3, 47, 18, 2047);
    			attr_dev(p3, "class", "col-start-8 row-start-2 text-xs text-center");
    			add_location(p3, file$3, 48, 18, 2098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, span2, anchor);
    			append_dev(span2, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, span4, anchor);
    			append_dev(span4, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, span6, anchor);
    			append_dev(span6, t20);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, p3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*remaining*/ 256 && t2_value !== (t2_value = /*remaining*/ ctx[8].days + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*remaining*/ 256 && t8_value !== (t8_value = /*remaining*/ ctx[8].hours + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*remaining*/ 256 && t14_value !== (t14_value = /*remaining*/ ctx[8].minutes + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*remaining*/ 256 && t20_value !== (t20_value = /*remaining*/ ctx[8].seconds + "")) set_data_dev(t20, t20_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:18) {#if remaining.done === false}",
    		ctx
    	});

    	return block;
    }

    // (31:12) <Countdown              from={eventTime}             dateFormat="YYYY-MM-DDTHH:mm:ssZ"              zone="Europe/Stockholm"             let:remaining>
    function create_default_slot(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*remaining*/ ctx[8].done === false) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "id", "countdownTimer");
    			attr_dev(div, "class", "grid justify-center grid-cols-8 text-3xl text-center text-gray-800 grid-row-2");
    			add_location(div, file$3, 35, 15, 1338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(31:12) <Countdown              from={eventTime}             dateFormat=\\\"YYYY-MM-DDTHH:mm:ssZ\\\"              zone=\\\"Europe/Stockholm\\\"             let:remaining>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div7;
    	let div0;
    	let t0;
    	let div6;
    	let div5;
    	let h4;
    	let t1;
    	let t2;
    	let div1;
    	let span;
    	let t3;
    	let t4;
    	let div2;
    	let h60;
    	let t5;
    	let t6;
    	let h61;
    	let t7;
    	let t8;
    	let div3;
    	let countdown;
    	let t9;
    	let div4;
    	let h62;
    	let t10;
    	let t11;
    	let h63;
    	let t12;
    	let t13;
    	let current;

    	countdown = new Countdown({
    			props: {
    				from: /*eventTime*/ ctx[7],
    				dateFormat: "YYYY-MM-DDTHH:mm:ssZ",
    				zone: "Europe/Stockholm",
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ remaining }) => ({ 8: remaining }),
    						({ remaining }) => remaining ? 256 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h4 = element("h4");
    			t1 = text(/*launchTitle*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			span = element("span");
    			t3 = text(/*rocketStatus*/ ctx[5]);
    			t4 = space();
    			div2 = element("div");
    			h60 = element("h6");
    			t5 = text(/*organization*/ ctx[1]);
    			t6 = space();
    			h61 = element("h6");
    			t7 = text(/*launchPadLocation*/ ctx[2]);
    			t8 = space();
    			div3 = element("div");
    			create_component(countdown.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			h62 = element("h6");
    			t10 = text(/*date*/ ctx[3]);
    			t11 = space();
    			h63 = element("h6");
    			t12 = text(/*time*/ ctx[4]);
    			t13 = text("hr");
    			attr_dev(div0, "class", "w-1/3 bg-center bg-no-repeat bg-cover ");
    			set_style(div0, "background-image", "url(" + /*rocketImage*/ ctx[6] + ")");
    			add_location(div0, file$3, 17, 5, 392);
    			attr_dev(h4, "id", "name");
    			attr_dev(h4, "class", "font-semibold text-center text-1xl");
    			add_location(h4, file$3, 21, 9, 614);
    			attr_dev(span, "alt", "Rocket Status");
    			attr_dev(span, "class", "flex items-center justify-center h-6 p-1 text-base text-white bg-green-500 rounded-full justify-self-center");
    			add_location(span, file$3, 23, 12, 745);
    			attr_dev(div1, "class", "flex justify-center");
    			add_location(div1, file$3, 22, 9, 699);
    			attr_dev(h60, "class", "text-base text-center");
    			add_location(h60, file$3, 26, 12, 988);
    			attr_dev(h61, "class", "text-base text-center");
    			add_location(h61, file$3, 27, 12, 1054);
    			attr_dev(div2, "id", "launchInformation");
    			attr_dev(div2, "class", "mb-1");
    			add_location(div2, file$3, 25, 9, 934);
    			attr_dev(div3, "id", "launchTime");
    			add_location(div3, file$3, 29, 9, 1138);
    			attr_dev(h62, "class", "text-base text-center");
    			add_location(h62, file$3, 56, 12, 2448);
    			attr_dev(h63, "id", "timer");
    			attr_dev(h63, "class", "text-base text-center");
    			add_location(h63, file$3, 57, 12, 2506);
    			attr_dev(div4, "id", "date");
    			attr_dev(div4, "class", "grid justify-center grid-cols-2 grid-rows-1 mt-3 mx-14 w-52");
    			add_location(div4, file$3, 55, 9, 2352);
    			attr_dev(div5, "id", "body");
    			attr_dev(div5, "class", "grid justify-center grid-cols-1");
    			add_location(div5, file$3, 20, 6, 549);
    			attr_dev(div6, "class", "w-2/3 p-2 md:text-lg");
    			add_location(div6, file$3, 19, 5, 508);
    			attr_dev(div7, "class", "flex w-auto overflow-hidden bg-white rounded-lg shadow-lg h-60");
    			add_location(div7, file$3, 16, 3, 310);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h4);
    			append_dev(h4, t1);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div1, span);
    			append_dev(span, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			append_dev(div2, h60);
    			append_dev(h60, t5);
    			append_dev(div2, t6);
    			append_dev(div2, h61);
    			append_dev(h61, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			mount_component(countdown, div3, null);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, h62);
    			append_dev(h62, t10);
    			append_dev(div4, t11);
    			append_dev(div4, h63);
    			append_dev(h63, t12);
    			append_dev(h63, t13);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*rocketImage*/ 64) {
    				set_style(div0, "background-image", "url(" + /*rocketImage*/ ctx[6] + ")");
    			}

    			if (!current || dirty & /*launchTitle*/ 1) set_data_dev(t1, /*launchTitle*/ ctx[0]);
    			if (!current || dirty & /*rocketStatus*/ 32) set_data_dev(t3, /*rocketStatus*/ ctx[5]);
    			if (!current || dirty & /*organization*/ 2) set_data_dev(t5, /*organization*/ ctx[1]);
    			if (!current || dirty & /*launchPadLocation*/ 4) set_data_dev(t7, /*launchPadLocation*/ ctx[2]);
    			const countdown_changes = {};
    			if (dirty & /*eventTime*/ 128) countdown_changes.from = /*eventTime*/ ctx[7];

    			if (dirty & /*$$scope, remaining*/ 768) {
    				countdown_changes.$$scope = { dirty, ctx };
    			}

    			countdown.$set(countdown_changes);
    			if (!current || dirty & /*date*/ 8) set_data_dev(t10, /*date*/ ctx[3]);
    			if (!current || dirty & /*time*/ 16) set_data_dev(t12, /*time*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(countdown);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, []);
    	let { launchTitle } = $$props;
    	let { organization } = $$props;
    	let { launchPadLocation } = $$props;
    	let { date } = $$props;
    	let { time } = $$props;
    	let { rocketStatus } = $$props;
    	let { rocketImage } = $$props;
    	let { eventTime } = $$props;

    	const writable_props = [
    		"launchTitle",
    		"organization",
    		"launchPadLocation",
    		"date",
    		"time",
    		"rocketStatus",
    		"rocketImage",
    		"eventTime"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("launchTitle" in $$props) $$invalidate(0, launchTitle = $$props.launchTitle);
    		if ("organization" in $$props) $$invalidate(1, organization = $$props.organization);
    		if ("launchPadLocation" in $$props) $$invalidate(2, launchPadLocation = $$props.launchPadLocation);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("time" in $$props) $$invalidate(4, time = $$props.time);
    		if ("rocketStatus" in $$props) $$invalidate(5, rocketStatus = $$props.rocketStatus);
    		if ("rocketImage" in $$props) $$invalidate(6, rocketImage = $$props.rocketImage);
    		if ("eventTime" in $$props) $$invalidate(7, eventTime = $$props.eventTime);
    	};

    	$$self.$capture_state = () => ({
    		Countdown,
    		launchTitle,
    		organization,
    		launchPadLocation,
    		date,
    		time,
    		rocketStatus,
    		rocketImage,
    		eventTime
    	});

    	$$self.$inject_state = $$props => {
    		if ("launchTitle" in $$props) $$invalidate(0, launchTitle = $$props.launchTitle);
    		if ("organization" in $$props) $$invalidate(1, organization = $$props.organization);
    		if ("launchPadLocation" in $$props) $$invalidate(2, launchPadLocation = $$props.launchPadLocation);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("time" in $$props) $$invalidate(4, time = $$props.time);
    		if ("rocketStatus" in $$props) $$invalidate(5, rocketStatus = $$props.rocketStatus);
    		if ("rocketImage" in $$props) $$invalidate(6, rocketImage = $$props.rocketImage);
    		if ("eventTime" in $$props) $$invalidate(7, eventTime = $$props.eventTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		launchTitle,
    		organization,
    		launchPadLocation,
    		date,
    		time,
    		rocketStatus,
    		rocketImage,
    		eventTime
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			launchTitle: 0,
    			organization: 1,
    			launchPadLocation: 2,
    			date: 3,
    			time: 4,
    			rocketStatus: 5,
    			rocketImage: 6,
    			eventTime: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*launchTitle*/ ctx[0] === undefined && !("launchTitle" in props)) {
    			console.warn("<Card> was created without expected prop 'launchTitle'");
    		}

    		if (/*organization*/ ctx[1] === undefined && !("organization" in props)) {
    			console.warn("<Card> was created without expected prop 'organization'");
    		}

    		if (/*launchPadLocation*/ ctx[2] === undefined && !("launchPadLocation" in props)) {
    			console.warn("<Card> was created without expected prop 'launchPadLocation'");
    		}

    		if (/*date*/ ctx[3] === undefined && !("date" in props)) {
    			console.warn("<Card> was created without expected prop 'date'");
    		}

    		if (/*time*/ ctx[4] === undefined && !("time" in props)) {
    			console.warn("<Card> was created without expected prop 'time'");
    		}

    		if (/*rocketStatus*/ ctx[5] === undefined && !("rocketStatus" in props)) {
    			console.warn("<Card> was created without expected prop 'rocketStatus'");
    		}

    		if (/*rocketImage*/ ctx[6] === undefined && !("rocketImage" in props)) {
    			console.warn("<Card> was created without expected prop 'rocketImage'");
    		}

    		if (/*eventTime*/ ctx[7] === undefined && !("eventTime" in props)) {
    			console.warn("<Card> was created without expected prop 'eventTime'");
    		}
    	}

    	get launchTitle() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set launchTitle(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get organization() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set organization(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get launchPadLocation() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set launchPadLocation(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rocketStatus() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rocketStatus(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rocketImage() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rocketImage(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventTime() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventTime(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/NavBar.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/NavBar.svelte";

    function create_fragment$2(ctx) {
    	let nav;
    	let div;
    	let h4;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "🚀 Upcoming Rocket Launches";
    			attr_dev(h4, "class", "text-6xl font-bold text-center no-underline text-grey-darkest hover:text-blue-dark");
    			add_location(h4, file$2, 2, 4, 151);
    			attr_dev(div, "class", "mb-2 sm:mb-0");
    			add_location(div, file$2, 1, 2, 120);
    			attr_dev(nav, "class", "flex flex-col w-full px-6 py-4 text-black sm:flex-row sm:text-left sm:justify-between sm:items-baseline");
    			add_location(nav, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, h4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavBar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.37.0 */

    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Made with Love by Alestry Perez 2021";
    			attr_dev(div0, "class", "flex mx-auto text-center text-white");
    			add_location(div0, file$1, 2, 8, 155);
    			attr_dev(div1, "class", "container flex flex-col flex-wrap items-center justify-between mx-auto");
    			add_location(div1, file$1, 1, 4, 62);
    			attr_dev(footer, "class", "w-full p-4 text-center bg-gray-900 pin-b");
    			add_location(footer, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/launchAPI.svelte generated by Svelte v3.37.0 */

    const apiUrl = `https://lldev.thespacedevs.com/2.2.0/launch/upcoming/`;

    const getData = async () => {
    	try {
    		const response = await fetch(apiUrl);

    		if (response.ok) {
    			const jsonResponse = await response.json();

    			// console.log(jsonResponse.results);
    			return jsonResponse.results;
    		}
    	} catch(error) {
    		console.log(`Uh,oh! ${error}`);
    	}
    };

    /* src/DateConverter.svelte generated by Svelte v3.37.0 */

    const convertDate = dateString => {
    	let newDate = new Date(dateString);

    	//console.log(newDate);
    	let readableDate = newDate.toLocaleDateString({
    		year: "numeric",
    		month: "numeric",
    		day: "numeric"
    	});

    	return readableDate;
    };

    const convertTime = timeString => {
    	let newTime = new Date(timeString);

    	// console.log(newTime);
    	let readableTime = newTime.toLocaleTimeString("en-IN", {
    		hour12: false,
    		hour: "2-digit",
    		minute: "2-digit",
    		second: "2-digit"
    	});

    	return readableTime;
    };

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].name;
    	child_ctx[2] = list[i].image;
    	child_ctx[3] = list[i].pad;
    	child_ctx[4] = list[i].net;
    	child_ctx[5] = list[i].launch_service_provider;
    	child_ctx[6] = list[i].status;
    	return child_ctx;
    }

    // (22:1) { #each events as {name, image, pad, net, launch_service_provider, status}
    function create_each_block(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				rocketImage: /*image*/ ctx[2],
    				launchTitle: /*name*/ ctx[1],
    				rocketStatus: /*status*/ ctx[6].abbrev,
    				organization: /*launch_service_provider*/ ctx[5].name,
    				launchPadLocation: /*pad*/ ctx[3].name,
    				eventTime: /*net*/ ctx[4],
    				date: convertDate(/*net*/ ctx[4]),
    				time: convertTime(/*net*/ ctx[4])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*events*/ 1) card_changes.rocketImage = /*image*/ ctx[2];
    			if (dirty & /*events*/ 1) card_changes.launchTitle = /*name*/ ctx[1];
    			if (dirty & /*events*/ 1) card_changes.rocketStatus = /*status*/ ctx[6].abbrev;
    			if (dirty & /*events*/ 1) card_changes.organization = /*launch_service_provider*/ ctx[5].name;
    			if (dirty & /*events*/ 1) card_changes.launchPadLocation = /*pad*/ ctx[3].name;
    			if (dirty & /*events*/ 1) card_changes.eventTime = /*net*/ ctx[4];
    			if (dirty & /*events*/ 1) card_changes.date = convertDate(/*net*/ ctx[4]);
    			if (dirty & /*events*/ 1) card_changes.time = convertTime(/*net*/ ctx[4]);
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:1) { #each events as {name, image, pad, net, launch_service_provider, status}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let div;
    	let t1;
    	let footer;
    	let current;
    	navbar = new NavBar({ $$inline: true });
    	let each_value = /*events*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "grid h-auto grid-cols-3 gap-2 pt-5 pb-5");
    			add_location(div, file, 20, 0, 391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*events, convertDate, convertTime*/ 1) {
    				each_value = /*events*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let events = [];

    	onMount(async () => {
    		$$invalidate(0, events = await getData());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Card,
    		NavBar,
    		Footer,
    		getData,
    		convertDate,
    		convertTime,
    		events
    	});

    	$$self.$inject_state = $$props => {
    		if ("events" in $$props) $$invalidate(0, events = $$props.events);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*events*/ 1) {
    			console.log(events);
    		}
    	};

    	return [events];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
