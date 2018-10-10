/*  Prototype JavaScript framework, version 1.7
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

const Prototype = {
  Version: '1.7',

  Browser: (function() {
    const ua = navigator.userAgent;
    const isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE: !!window.attachEvent && !isOpera,
      Opera: isOpera,
      WebKit: ua.indexOf('AppleWebKit/') > -1,
      Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari: /Apple.*Mobile/.test(ua)
    };
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,

    SelectorsAPI: !!document.querySelector,

    ElementExtensions: (function() {
      const constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== 'undefined') return true;

      let div = document.createElement('div');

      var form = document.createElement('form');

      var isSupported = false;

      if (div.__proto__ && div.__proto__ !== form.__proto__) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)</script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction() {},

  K(x) {
    return x;
  }
};

if (Prototype.Browser.MobileSafari) Prototype.BrowserFeatures.SpecificElementExtensions = false;

const Abstract = {};

const Try = {
  these() {
    let returnValue;

    for (let i = 0, length = arguments.length; i < length; i++) {
      let lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
  }
};

/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {
  const IS_DONTENUM_BUGGY = (function() {
    for (const p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function subclass() {}
  function create() {
    let parent = null;

    var properties = $A(arguments);
    if (Object.isFunction(properties[0])) parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass();
      parent.subclasses.push(klass);
    }

    for (let i = 0, length = properties.length; i < length; i++) klass.addMethods(properties[i]);

    if (!klass.prototype.initialize) klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    const ancestor = this.superclass && this.superclass.prototype;

    var properties = Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString) properties.push('toString');
      if (source.valueOf != Object.prototype.valueOf) properties.push('valueOf');
    }

    for (let i = 0, length = properties.length; i < length; i++) {
      const property = properties[i];

      var value = source[property];
      if (ancestor && Object.isFunction(value) && value.argumentNames()[0] == '$super') {
        const method = value;
        value = (function(m) {
          return function() {
            return ancestor[m].apply(this, arguments);
          };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create,
    Methods: {
      addMethods
    }
  };
})();
(function() {
  const _toString = Object.prototype.toString;

  var NULL_TYPE = 'Null';

  var UNDEFINED_TYPE = 'Undefined';

  var BOOLEAN_TYPE = 'Boolean';

  var NUMBER_TYPE = 'Number';

  var STRING_TYPE = 'String';

  var OBJECT_TYPE = 'Object';

  var FUNCTION_CLASS = '[object Function]';

  var BOOLEAN_CLASS = '[object Boolean]';

  var NUMBER_CLASS = '[object Number]';

  var STRING_CLASS = '[object String]';

  var ARRAY_CLASS = '[object Array]';

  var DATE_CLASS = '[object Date]';

  var NATIVE_JSON_STRINGIFY_SUPPORT =
    window.JSON &&
    typeof JSON.stringify === 'function' &&
    JSON.stringify(0) === '0' &&
    typeof JSON.stringify(Prototype.K) === 'undefined';

  function Type(o) {
    switch (o) {
      case null:
        return NULL_TYPE;
      case void 0:
        return UNDEFINED_TYPE;
    }
    const type = typeof o;
    switch (type) {
      case 'boolean':
        return BOOLEAN_TYPE;
      case 'number':
        return NUMBER_TYPE;
      case 'string':
        return STRING_TYPE;
    }
    return OBJECT_TYPE;
  }

  function extend(destination, source) {
    for (const property in source) destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(value) {
    return Str('', { '': value }, []);
  }

  function Str(key, holder, stack) {
    let value = holder[key];

    var type = typeof value;

    if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    const _class = _toString.call(value);

    switch (_class) {
      case NUMBER_CLASS:
      case BOOLEAN_CLASS:
      case STRING_CLASS:
        value = value.valueOf();
    }

    switch (value) {
      case null:
        return 'null';
      case true:
        return 'true';
      case false:
        return 'false';
    }

    type = typeof value;
    switch (type) {
      case 'string':
        return value.inspect(true);
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':
        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError();
          }
        }
        stack.push(value);

        var partial = [];
        if (_class === ARRAY_CLASS) {
          for (var i = 0, length = value.length; i < length; i++) {
            var str = Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = `[${partial.join(',')}]`;
        } else {
          const keys = Object.keys(value);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];

            var str = Str(key, value, stack);
            if (typeof str !== 'undefined') {
              partial.push(`${key.inspect(true)}:${str}`);
            }
          }
          partial = `{${partial.join(',')}}`;
        }
        stack.pop();
        return partial;
    }
  }

  function stringify(object) {
    return JSON.stringify(object);
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    if (Type(object) !== OBJECT_TYPE) {
      throw new TypeError();
    }
    const results = [];
    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        results.push(property);
      }
    }
    return results;
  }

  function values(object) {
    const results = [];
    for (const property in object) results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({}, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }

  const hasNativeIsArray = typeof Array.isArray === 'function' && Array.isArray([]) && !Array.isArray({});

  if (hasNativeIsArray) {
    isArray = Array.isArray;
  }

  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return _toString.call(object) === FUNCTION_CLASS;
  }

  function isString(object) {
    return _toString.call(object) === STRING_CLASS;
  }

  function isNumber(object) {
    return _toString.call(object) === NUMBER_CLASS;
  }

  function isDate(object) {
    return _toString.call(object) === DATE_CLASS;
  }

  function isUndefined(object) {
    return typeof object === 'undefined';
  }

  extend(Object, {
    extend,
    inspect,
    toJSON: NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
    toQueryString,
    toHTML,
    keys: Object.keys || keys,
    values,
    clone,
    isElement,
    isArray,
    isHash,
    isFunction,
    isString,
    isNumber,
    isDate,
    isUndefined
  });
})();
Object.extend(
  Function.prototype,
  (function() {
    const slice = Array.prototype.slice;

    function update(array, args) {
      const arrayLength = array.length;

      var length = args.length;
      while (length--) array[arrayLength + length] = args[length];
      return array;
    }

    function merge(array, args) {
      array = slice.call(array, 0);
      return update(array, args);
    }

    function argumentNames() {
      const names = this.toString()
        .match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '')
        .split(',');
      return names.length == 1 && !names[0] ? [] : names;
    }

    function bind(context) {
      if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
      const __method = this;

      var args = slice.call(arguments, 1);
      return function() {
        const a = merge(args, arguments);
        return __method.apply(context, a);
      };
    }

    function bindAsEventListener(context) {
      const __method = this;

      var args = slice.call(arguments, 1);
      return function(event) {
        const a = update([event || window.event], args);
        return __method.apply(context, a);
      };
    }

    function curry() {
      if (!arguments.length) return this;
      const __method = this;

      var args = slice.call(arguments, 0);
      return function() {
        const a = merge(args, arguments);
        return __method.apply(this, a);
      };
    }

    function delay(timeout) {
      const __method = this;

      var args = slice.call(arguments, 1);
      timeout *= 1000;
      return window.setTimeout(() => __method.apply(__method, args), timeout);
    }

    function defer() {
      const args = update([0.01], arguments);
      return this.delay.apply(this, args);
    }

    function wrap(wrapper) {
      const __method = this;
      return function() {
        const a = update([__method.bind(this)], arguments);
        return wrapper.apply(this, a);
      };
    }

    function methodize() {
      if (this._methodized) return this._methodized;
      const __method = this;
      return (this._methodized = function() {
        const a = update([this], arguments);
        return __method(...a);
      });
    }

    return {
      argumentNames,
      bind,
      bindAsEventListener,
      curry,
      delay,
      defer,
      wrap,
      methodize
    };
  })()
);

(function(proto) {
  function toISOString() {
    return `${this.getUTCFullYear()}-${(this.getUTCMonth() + 1).toPaddedString(2)}-${this.getUTCDate().toPaddedString(
      2
    )}T${this.getUTCHours().toPaddedString(2)}:${this.getUTCMinutes().toPaddedString(
      2
    )}:${this.getUTCSeconds().toPaddedString(2)}Z`;
  }

  function toJSON() {
    return this.toISOString();
  }

  if (!proto.toISOString) proto.toISOString = toISOString;
  if (!proto.toJSON) proto.toJSON = toJSON;
})(Date.prototype);

RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
const PeriodicalExecuter = Class.create({
  initialize(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute() {
    this.callback(this);
  },

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch (e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(
  String.prototype,
  (function() {
    const NATIVE_JSON_PARSE_SUPPORT =
      window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test;

    function prepareReplacement(replacement) {
      if (Object.isFunction(replacement)) return replacement;
      const template = new Template(replacement);
      return function(match) {
        return template.evaluate(match);
      };
    }

    function gsub(pattern, replacement) {
      let result = '';

      var source = this;

      var match;
      replacement = prepareReplacement(replacement);

      if (Object.isString(pattern)) pattern = RegExp.escape(pattern);

      if (!(pattern.length || pattern.source)) {
        replacement = replacement('');
        return replacement + source.split('').join(replacement) + replacement;
      }

      while (source.length > 0) {
        if ((match = source.match(pattern))) {
          result += source.slice(0, match.index);
          result += String.interpret(replacement(match));
          source = source.slice(match.index + match[0].length);
        } else {
          (result += source), (source = '');
        }
      }
      return result;
    }

    function sub(pattern, replacement, count) {
      replacement = prepareReplacement(replacement);
      count = Object.isUndefined(count) ? 1 : count;

      return this.gsub(pattern, match => {
        if (--count < 0) return match[0];
        return replacement(match);
      });
    }

    function scan(pattern, iterator) {
      this.gsub(pattern, iterator);
      return String(this);
    }

    function truncate(length, truncation) {
      length = length || 30;
      truncation = Object.isUndefined(truncation) ? '...' : truncation;
      return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
      return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function stripScripts() {
      return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }

    function extractScripts() {
      const matchAll = new RegExp(Prototype.ScriptFragment, 'img');

      var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
      return (this.match(matchAll) || []).map(scriptTag => (scriptTag.match(matchOne) || ['', ''])[1]);
    }

    function evalScripts() {
      return this.extractScripts().map(script => eval(script));
    }

    function escapeHTML() {
      return this.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function unescapeHTML() {
      return this.stripTags()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    }

    function toQueryParams(separator) {
      const match = this.strip().match(/([^?#]*)(#.*)?$/);
      if (!match) return {};

      return match[1].split(separator || '&').inject({}, (hash, pair) => {
        if ((pair = pair.split('='))[0]) {
          let key = decodeURIComponent(pair.shift());

            
var value = pair.length > 1 ? pair.join('=') : pair[0];

          if (value != undefined) value = decodeURIComponent(value);

          if (key in hash) {
            if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
            hash[key].push(value);
          } else hash[key] = value;
        }
        return hash;
      });
    }

    function toArray() {
      return this.split('');
    }

    function succ() {
      return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }

    function times(count) {
      return count < 1 ? '' : new Array(count + 1).join(this);
    }

    function camelize() {
      return this.replace(/-+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '');
    }

    function capitalize() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
      return this.replace(/::/g, '/')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        .replace(/-/g, '_')
        .toLowerCase();
    }

    function dasherize() {
      return this.replace(/_/g, '-');
    }

    function inspect(useDoubleQuotes) {
      const escapedString = this.replace(/[\x00-\x1f\\]/g, character => {
        if (character in String.specialChar) {
          return String.specialChar[character];
        }
        return `\\u00${  character.charCodeAt().toPaddedString(2, 16)}`;
      });
      if (useDoubleQuotes) return `"${escapedString.replace(/"/g, '\\"')}"`;
      return `'${escapedString.replace(/'/g, "\\'")}'`;
    }

    function unfilterJSON(filter) {
      return this.replace(filter || Prototype.JSONFilter, '$1');
    }

    function isJSON() {
      let str = this;
      if (str.blank()) return false;
      str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
      str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
      str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
      return /^[\],:{}\s]*$/.test(str);
    }

    function evalJSON(sanitize) {
      let json = this.unfilterJSON();

      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      if (cx.test(json)) {
        json = json.replace(cx, a => '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
      }
      try {
        if (!sanitize || json.isJSON()) return eval(`(${json})`);
      } catch (e) {}
      throw new SyntaxError(`Badly formed JSON string: ${this.inspect()}`);
    }

    function parseJSON() {
      const json = this.unfilterJSON();
      return JSON.parse(json);
    }

    function include(pattern) {
      return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern) {
      return this.lastIndexOf(pattern, 0) === 0;
    }

    function endsWith(pattern) {
      const d = this.length - pattern.length;
      return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
      return this == '';
    }

    function blank() {
      return /^\s*$/.test(this);
    }

    function interpolate(object, pattern) {
      return new Template(this, pattern).evaluate(object);
    }

    return {
      gsub,
      sub,
      scan,
      truncate,
      strip: String.prototype.trim || strip,
      stripTags,
      stripScripts,
      extractScripts,
      evalScripts,
      escapeHTML,
      unescapeHTML,
      toQueryParams,
      parseQuery: toQueryParams,
      toArray,
      succ,
      times,
      camelize,
      capitalize,
      underscore,
      dasherize,
      inspect,
      unfilterJSON,
      isJSON,
      evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
      include,
      startsWith,
      endsWith,
      empty,
      blank,
      interpolate
    };
  })()
);

var Template = Class.create({
  initialize(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate(object) {
    if (object && Object.isFunction(object.toTemplateReplacements)) object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, (match) => {
      if (object == null) return match[1] + '';

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object,
        expr = match[3],
        pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

const $break = {};

const Enumerable = (function() {
  function each(iterator, context) {
    let index = 0;
    try {
      this._each(value => {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    let index = -number;

    var slices = [];

    var array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length) slices.push(array.slice(index, index + number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    let result = true;
    this.each((value, index) => {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    let result = false;
    this.each((value, index) => {
      if ((result = !!iterator.call(context, value, index))) throw $break;
    });
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    const results = [];
    this.each((value, index) => {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function detect(iterator, context) {
    let result;
    this.each((value, index) => {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  }

  function findAll(iterator, context) {
    const results = [];
    this.each((value, index) => {
      if (iterator.call(context, value, index)) results.push(value);
    });
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    const results = [];

    if (Object.isString(filter)) filter = new RegExp(RegExp.escape(filter));

    this.each((value, index) => {
      if (filter.match(value)) results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf)) if (this.indexOf(object) != -1) return true;

    let found = false;
    this.each(value => {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, slice => {
      while (slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each((value, index) => {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  }

  function invoke(method) {
    const args = $A(arguments).slice(1);
    return this.map(value => value[method].apply(value, args));
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    let result;
    this.each((value, index) => {
      value = iterator.call(context, value, index);
      if (result == null || value >= result) result = value;
    });
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    let result;
    this.each((value, index) => {
      value = iterator.call(context, value, index);
      if (result == null || value < result) result = value;
    });
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    const trues = [];

    var falses = [];
    this.each((value, index) => {
      (iterator.call(context, value, index) ? trues : falses).push(value);
    });
    return [trues, falses];
  }

  function pluck(property) {
    const results = [];
    this.each(value => {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    const results = [];
    this.each((value, index) => {
      if (!iterator.call(context, value, index)) results.push(value);
    });
    return results;
  }

  function sortBy(iterator, context) {
    return this.map((value, index) => ({
        value: value,
        criteria: iterator.call(context, value, index)
      }))
      .sort((left, right) => {
        let a = left.criteria;

          
var b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      })
      .pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    let iterator = Prototype.K;

    var args = $A(arguments);
    if (Object.isFunction(args.last())) iterator = args.pop();

    const collections = [this].concat(args).map($A);
    return this.map((value, index) => iterator(collections.pluck(index)));
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return `#<Enumerable:${this.toArray().inspect()}>`;
  }

  return {
    each,
    eachSlice,
    all,
    every: all,
    any,
    some: any,
    collect,
    map: collect,
    detect,
    findAll,
    select: findAll,
    filter: findAll,
    grep,
    include,
    member: include,
    inGroupsOf,
    inject,
    invoke,
    max,
    min,
    partition,
    pluck,
    reject,
    sortBy,
    toArray,
    entries: toArray,
    zip,
    size,
    inspect,
    find: detect
  };
})();

function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  let length = iterable.length || 0;

  var results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;

(function() {
  const arrayProto = Array.prototype;

  var slice = arrayProto.slice;

  var _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator, context) {
    for (let i = 0, length = this.length >>> 0; i < length; i++) {
      if (i in this) iterator.call(context, this[i], i, this);
    }
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select(value => value != null);
  }

  function flatten() {
    return this.inject([], (array, value) => {
      if (Object.isArray(value)) return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    const values = slice.call(arguments, 0);
    return this.select(value => !values.include(value));
  }

  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }

  function uniq(sorted) {
    return this.inject([], (array, value, index) => {
      if (index == 0 || (sorted ? array.last() != value : !array.include(value))) array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(item => array.detect(function(value) {
        return item === value;
      }));
  }

  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return `[${this.map(Object.inspect).join(', ')}]`;
  }

  function indexOf(item, i) {
    i || (i = 0);
    const length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++) if (this[i] === item) return i;
    return -1;
  }

  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    const n = this.slice(0, i)
      .reverse()
      .indexOf(item);
    return n < 0 ? n : i - n - 1;
  }

  function concat() {
    const array = slice.call(this, 0);

    var item;
    for (let i = 0, length = arguments.length; i < length; i++) {
      item = arguments[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (let j = 0, arrayLength = item.length; j < arrayLength; j++) array.push(item[j]);
      } else {
        array.push(item);
      }
    }
    return array;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse) arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each,
    clear,
    first,
    last,
    compact,
    flatten,
    without,
    reverse,
    uniq,
    intersect,
    clone,
    toArray: clone,
    size,
    inspect
  });

  const CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1, 2);

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
}

var Hash = Class.create(
  Enumerable,
  (function() {
    function initialize(object) {
      this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    }

    function _each(iterator) {
      for (const key in this._object) {
        const value = this._object[key];

        var pair = [key, value];
        pair.key = key;
        pair.value = value;
        iterator(pair);
      }
    }

    function set(key, value) {
      return (this._object[key] = value);
    }

    function get(key) {
      if (this._object[key] !== Object.prototype[key]) return this._object[key];
    }

    function unset(key) {
      const value = this._object[key];
      delete this._object[key];
      return value;
    }

    function toObject() {
      return Object.clone(this._object);
    }

    function keys() {
      return this.pluck('key');
    }

    function values() {
      return this.pluck('value');
    }

    function index(value) {
      const match = this.detect(pair => pair.value === value);
      return match && match.key;
    }

    function merge(object) {
      return this.clone().update(object);
    }

    function update(object) {
      return new Hash(object).inject(this, (result, pair) => {
        result.set(pair.key, pair.value);
        return result;
      });
    }

    function toQueryPair(key, value) {
      if (Object.isUndefined(value)) return key;
      return `${key}=${encodeURIComponent(String.interpret(value))}`;
    }

    function toQueryString() {
      return this.inject([], (results, pair) => {
        let key = encodeURIComponent(pair.key);

          
var values = pair.value;

        if (values && typeof values === 'object') {
          if (Object.isArray(values)) {
            let queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
              value = values[i];
              queryValues.push(toQueryPair(key, value));
            }
            return results.concat(queryValues);
          }
        } else results.push(toQueryPair(key, values));
        return results;
      }).join('&');
    }

    function inspect() {
      return `#<Hash:{${this.map((pair) => {
          return pair.map(Object.inspect).join(': ');
        }).join(', ') 
        }}>`
      );
    }

    function clone() {
      return new Hash(this);
    }

    return {
      initialize,
      _each,
      set,
      get,
      unset,
      toObject,
      toTemplateReplacements: toObject,
      keys,
      values,
      index,
      merge,
      update,
      toQueryString,
      inspect,
      toJSON: toObject,
      clone
    };
  })()
);

Hash.from = $H;
Object.extend(
  Number.prototype,
  (function() {
    function toColorPart() {
      return this.toPaddedString(2, 16);
    }

    function succ() {
      return this + 1;
    }

    function times(iterator, context) {
      $R(0, this, true).each(iterator, context);
      return this;
    }

    function toPaddedString(length, radix) {
      const string = this.toString(radix || 10);
      return '0'.times(length - string.length) + string;
    }

    function abs() {
      return Math.abs(this);
    }

    function round() {
      return Math.round(this);
    }

    function ceil() {
      return Math.ceil(this);
    }

    function floor() {
      return Math.floor(this);
    }

    return {
      toColorPart,
      succ,
      times,
      toPaddedString,
      abs,
      round,
      ceil,
      floor
    };
  })()
);

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(
  Enumerable,
  (function() {
    function initialize(start, end, exclusive) {
      this.start = start;
      this.end = end;
      this.exclusive = exclusive;
    }

    function _each(iterator) {
      let value = this.start;
      while (this.include(value)) {
        iterator(value);
        value = value.succ();
      }
    }

    function include(value) {
      if (value < this.start) return false;
      if (this.exclusive) return value < this.end;
      return value <= this.end;
    }

    return {
      initialize,
      _each,
      include
    };
  })()
);

const Ajax = {
  getTransport() {
    return (
      Try.these(
        () => {
          return new XMLHttpRequest();
        },
        () => {
          return new ActiveXObject('Msxml2.XMLHTTP');
        },
        () => {
          return new ActiveXObject('Microsoft.XMLHTTP');
        }
      ) || false
    );
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each(iterator) {
    this.responders._each(iterator);
  },

  register(responder) {
    if (!this.include(responder)) this.responders.push(responder);
  },

  unregister(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch(callback, request, transport, json) {
    this.each((responder) => {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate() {
    Ajax.activeRequestCount++;
  },
  onComplete() {
    Ajax.activeRequestCount--;
  }
});
Ajax.Base = Class.create({
  initialize(options) {
    this.options = {
      method: 'post',
      asynchronous: true,
      contentType: 'application/x-www-form-urlencoded',
      encoding: 'UTF-8',
      parameters: '',
      evalJSON: true,
      evalJS: true
    };
    Object.extend(this.options, options || {});

    this.options.method = this.options.method.toLowerCase();

    if (Object.isHash(this.options.parameters)) this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request(url) {
    this.url = url;
    this.method = this.options.method;
    let params = Object.isString(this.options.parameters)
      ? this.options.parameters
      : Object.toQueryString(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params += `${params ? '&' : ''  }_method=${  this.method}`;
      this.method = 'post';
    }

    if (params && this.method === 'get') {
      this.url += (this.url.include('?') ? '&' : '?') + params;
    }

    this.parameters = params.toQueryParams();

    try {
      let response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? this.options.postBody || params : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType) this.onStateChange();
    } catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange() {
    let readyState = this.transport.readyState;
    if (readyState > 1 && !(readyState == 4 && this._complete)) this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders() {
    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      Accept: 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] =
        this.options.contentType + (this.options.encoding ? `; charset=${  this.options.encoding}` : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005)
        headers.Connection = 'close';
    }

    if (typeof this.options.requestHeaders === 'object') {
      let extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (let i = 0, length = extras.length; i < length; i += 2) headers[extras[i]] = extras[i + 1];
      else
        $H(extras).each((pair) => {
          headers[pair.key] = pair.value;
        });
    }

    for (let name in headers) this.transport.setRequestHeader(name, headers[name]);
  },

  success() {
    let status = this.getStatus();
    return !status || (status >= 200 && status < 300) || status == 304;
  },

  getStatus() {
    try {
      if (this.transport.status === 1223) return 204;
      return this.transport.status || 0;
    } catch (e) {
      return 0;
    }
  },

  respondToReadyState(readyState) {
    let state = Ajax.Request.Events[readyState];

      
var response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options[`on${  response.status}`] ||
          this.options[`on${  this.success() ? 'Success' : 'Failure'}`] ||
          Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      let contentType = response.getHeader('Content-type');
      if (
        this.options.evalJS == 'force' ||
        (this.options.evalJS &&
          this.isSameOrigin() &&
          contentType &&
          contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))
      )
        this.evalResponse();
    }

    try {
      (this.options[`on${  state}`] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch(`on${  state}`, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin() {
    let m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return (
      !m ||
      m[0] ==
        '#{protocol}//#{domain}#{port}'.interpolate({
          protocol: location.protocol,
          domain: document.domain,
          port: location.port ? `:${  location.port}` : ''
        })
    );
  },

  getHeader(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) {
      return null;
    }
  },

  evalResponse() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
  initialize(request) {
    this.request = request;
    let transport = (this.transport = request.transport);

      
var readyState = (this.readyState = transport.readyState);

    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status = this.getStatus();
      this.statusText = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON = this._getHeaderJSON();
    }

    if (readyState == 4) {
      let xml = transport.responseXML;
      this.responseXML = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status: 0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText() {
    try {
      return this.transport.statusText || '';
    } catch (e) {
      return '';
    }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) {
      return null;
    }
  },

  getResponseHeader(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON() {
    let json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON() {
    let options = this.request.options;
    if (
      !options.evalJSON ||
      (options.evalJSON != 'force' && !(this.getHeader('Content-type') || '').include('application/json')) ||
      this.responseText.blank()
    )
      return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON || !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize($super, container, url, options) {
    this.container = {
      success: container.success || container,
      failure: container.failure || (container.success ? null : container)
    };

    options = Object.clone(options);
    let onComplete = options.onComplete;
    options.onComplete = function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }.bind(this);

    $super(url, options);
  },

  updateContent(responseText) {
    let receiver = this.container[this.success() ? 'success' : 'failure'];

      
var options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if ((receiver = $(receiver))) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          let insertion = {};
          insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        } else options.insertion(receiver, responseText);
      } else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = this.options.frequency || 2;
    this.decay = this.options.decay || 1;

    this.updater = {};
    this.container = container;
    this.url = url;

    this.start();
  },

  start() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete(response) {
    if (this.options.decay) {
      this.decay = response.responseText == this.lastText ? this.decay * this.options.decay : 1;

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});

function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++) elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element)) element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    const results = [];
    const query = document.evaluate(
      expression,
      $(parentElement) || document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0, length = query.snapshotLength; i < length; i++) results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!Node) var Node = {};

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}

(function(global) {
  function shouldUseCache(tagName, attributes) {
    if (tagName === 'select') return false;
    if ('type' in attributes) return false;
    return true;
  }

  const HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function() {
    try {
      const el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    } catch (err) {
      return false;
    }
  })();

  const element = global.Element;

  global.Element = function(tagName, attributes) {
    attributes = attributes || {};
    tagName = tagName.toLowerCase();
    const cache = Element.cache;

    if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
      tagName = `<${tagName} name="${attributes.name}">`;
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }

    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));

    const node = shouldUseCache(tagName, attributes) ? cache[tagName].cloneNode(false) : document.createElement(tagName);

    return Element.writeAttribute(node, attributes);
  };

  Object.extend(global.Element, element || {});
  if (element) global.Element.prototype = element.prototype;
})(this);

Element.idCounter = 1;
Element.cache = {};

Element._purgeElement = function(element) {
  const uid = element._prototypeUID;
  if (uid) {
    Element.stopObserving(element);
    element._prototypeUID = void 0;
    delete Element.Storage[uid];
  }
};

Element.Methods = {
  visible(element) {
    return $(element).style.display != 'none';
  },

  toggle(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: (function() {
    const SELECT_ELEMENT_INNERHTML_BUGGY = (function() {
      let el = document.createElement('select');

      var isBuggy = true;
      el.innerHTML = '<option value="test">test</option>';
      if (el.options && el.options[0]) {
        isBuggy = el.options[0].nodeName.toUpperCase() !== 'OPTION';
      }
      el = null;
      return isBuggy;
    })();

    const TABLE_ELEMENT_INNERHTML_BUGGY = (function() {
      try {
        let el = document.createElement('table');
        if (el && el.tBodies) {
          el.innerHTML = '<tbody><tr><td>test</td></tr></tbody>';
          const isBuggy = typeof el.tBodies[0] === 'undefined';
          el = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    })();

    const LINK_ELEMENT_INNERHTML_BUGGY = (function() {
      try {
        let el = document.createElement('div');
        el.innerHTML = '<link>';
        const isBuggy = el.childNodes.length === 0;
        el = null;
        return isBuggy;
      } catch (e) {
        return true;
      }
    })();

    const ANY_INNERHTML_BUGGY =
      SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;

    const SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function() {
      let s = document.createElement('script');

      var isBuggy = false;
      try {
        s.appendChild(document.createTextNode(''));
        isBuggy = !s.firstChild || (s.firstChild && s.firstChild.nodeType !== 3);
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    })();

    function update(element, content) {
      element = $(element);
      const purgeElement = Element._purgeElement;

      const descendants = element.getElementsByTagName('*');

      var i = descendants.length;
      while (i--) purgeElement(descendants[i]);

      if (content && content.toElement) content = content.toElement();

      if (Object.isElement(content)) return element.update().insert(content);

      content = Object.toHTML(content);

      const tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        element.text = content;
        return element;
      }

      if (ANY_INNERHTML_BUGGY) {
        if (tagName in Element._insertionTranslations.tags) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          Element._getContentFromAnonymousElement(tagName, content.stripScripts()).each(node => {
            element.appendChild(node);
          });
        } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          const nodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts(), true);
          nodes.each(node => {
            element.appendChild(node);
          });
        } else {
          element.innerHTML = content.stripScripts();
        }
      } else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      return element;
    }

    return update;
  })(),

  replace(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      let range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert(element, insertions) {
    element = $(element);

    if (
      Object.isString(insertions) ||
      Object.isNumber(insertions) ||
      Object.isElement(insertions) ||
      (insertions && (insertions.toElement || insertions.toHTML))
    )
      insertions = { bottom: insertions };

    let content; var insert; var tagName; var childNodes;

    for (let position in insertions) {
      content = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = (position == 'before' || position == 'after' ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper)) $(wrapper).writeAttribute(attributes || {});
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode) element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect(element) {
    element = $(element);
    let result = `<${  element.tagName.toLowerCase()}`;
    $H({ id: 'id', className: 'class' }).each((pair) => {
      var property = pair.first(),
        attribute = pair.last(),
        value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return `${result  }>`;
  },

  recursivelyCollect(element, property, maximumLength) {
    element = $(element);
    maximumLength = maximumLength || -1;
    let elements = [];

    while ((element = element[property])) {
      if (element.nodeType == 1) elements.push(Element.extend(element));
      if (elements.length == maximumLength) break;
    }

    return elements;
  },

  ancestors(element) {
    return Element.recursivelyCollect(element, 'parentNode');
  },

  descendants(element) {
    return Element.select(element, '*');
  },

  firstDescendant(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants(element) {
    let results = [];

      
var child = $(element).firstChild;
    while (child) {
      if (child.nodeType === 1) {
        results.push(Element.extend(child));
      }
      child = child.nextSibling;
    }
    return results;
  },

  previousSiblings(element, maximumLength) {
    return Element.recursivelyCollect(element, 'previousSibling');
  },

  nextSiblings(element) {
    return Element.recursivelyCollect(element, 'nextSibling');
  },

  siblings(element) {
    element = $(element);
    return Element.previousSiblings(element)
      .reverse()
      .concat(Element.nextSiblings(element));
  },

  match(element, selector) {
    element = $(element);
    if (Object.isString(selector)) return Prototype.Selector.match(element, selector);
    return selector.match(element);
  },

  up(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    let ancestors = Element.ancestors(element);
    return Object.isNumber(expression) ? ancestors[expression] : Prototype.Selector.find(ancestors, expression, index);
  },

  down(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return Element.firstDescendant(element);
    return Object.isNumber(expression)
      ? Element.descendants(element)[expression]
      : Element.select(element, expression)[index || 0];
  },

  previous(element, expression, index) {
    element = $(element);
    if (Object.isNumber(expression)) (index = expression), (expression = false);
    if (!Object.isNumber(index)) index = 0;

    if (expression) {
      return Prototype.Selector.find(element.previousSiblings(), expression, index);
    } 
      return element.recursivelyCollect('previousSibling', index + 1)[index];
    
  },

  next(element, expression, index) {
    element = $(element);
    if (Object.isNumber(expression)) (index = expression), (expression = false);
    if (!Object.isNumber(index)) index = 0;

    if (expression) {
      return Prototype.Selector.find(element.nextSiblings(), expression, index);
    } 
      var maximumLength = Object.isNumber(index) ? index + 1 : 1;
      return element.recursivelyCollect('nextSibling', index + 1)[index];
    
  },

  select(element) {
    element = $(element);
    let expressions = Array.prototype.slice.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element);
  },

  adjacent(element) {
    element = $(element);
    let expressions = Array.prototype.slice.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element.parentNode).without(element);
  },

  identify(element) {
    element = $(element);
    let id = Element.readAttribute(element, 'id');
    if (id) return id;
    do {
      id = `anonymous_element_${  Element.idCounter++}`;
    } while ($(id));
    Element.writeAttribute(element, 'id', id);
    return id;
  },

  readAttribute(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      let t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return !element.attributes || !element.attributes[name] ? null : element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute(element, name, value) {
    element = $(element);
    let attributes = {};

      
var t = Element._attributeTranslations.write;

    if (typeof name === 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (let attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null) element.removeAttribute(name);
      else if (value === true) element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight(element) {
    return Element.getDimensions(element).height;
  },

  getWidth(element) {
    return Element.getDimensions(element).width;
  },

  classNames(element) {
    return new Element.ClassNames(element);
  },

  hasClassName(element, className) {
    if (!(element = $(element))) return;
    let elementClassName = element.className;
    return (
      elementClassName.length > 0 &&
      (elementClassName == className || new RegExp(`(^|\\s)${  className  }(\\s|$)`).test(elementClassName))
    );
  },

  addClassName(element, className) {
    if (!(element = $(element))) return;
    if (!Element.hasClassName(element, className)) element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(new RegExp(`(^|\\s+)${  className  }(\\s+|$)`), ' ').strip();
    return element;
  },

  toggleClassName(element, className) {
    if (!(element = $(element))) return;
    return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
  },

  cleanWhitespace(element) {
    element = $(element);
    let node = element.firstChild;
    while (node) {
      let nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf(element, ancestor) {
    (element = $(element)), (ancestor = $(ancestor));

    if (element.compareDocumentPosition) return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains) return ancestor.contains(element) && ancestor !== element;

    while ((element = element.parentNode)) if (element == ancestor) return true;

    return false;
  },

  scrollTo(element) {
    element = $(element);
    let pos = Element.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    let value = element.style[style];
    if (!value || value == 'auto') {
      let css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity(element) {
    return $(element).getStyle('opacity');
  },

  setStyle(element, styles) {
    element = $(element);
    let elementStyle = element.style;

      
var match;
    if (Object.isString(styles)) {
      element.style.cssText += `;${  styles}`;
      return styles.include('opacity') ? element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (let property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[
          property == 'float' || property == 'cssFloat'
            ? Object.isUndefined(elementStyle.styleFloat)
              ? 'cssFloat'
              : 'styleFloat'
            : property
        ] = styles[property];

    return element;
  },

  setOpacity(element, value) {
    element = $(element);
    element.style.opacity = value == 1 || value === '' ? '' : value < 0.00001 ? 0 : value;
    return element;
  },

  makePositioned(element) {
    element = $(element);
    let pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position = element.style.top = element.style.left = element.style.bottom = element.style.right = '';
    }
    return element;
  },

  makeClipping(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden') element.style.overflow = 'hidden';
    return element;
  },

  undoClipping(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  clonePosition(element, source) {
    let options = Object.extend(
      {
        setLeft: true,
        setTop: true,
        setWidth: true,
        setHeight: true,
        offsetTop: 0,
        offsetLeft: 0
      },
      arguments[2] || {}
    );

    source = $(source);
    let p = Element.viewportOffset(source);

      
var delta = [0, 0];

      
var parent = null;

    element = $(element);

    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft) element.style.left = `${p[0] - delta[0] + options.offsetLeft  }px`;
    if (options.setTop) element.style.top = `${p[1] - delta[1] + options.offsetTop  }px`;
    if (options.setWidth) element.style.width = `${source.offsetWidth  }px`;
    if (options.setHeight) element.style.height = `${source.offsetHeight  }px`;
    return element;
  }
};

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,

  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor: 'for'
    },
    values: {}
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap((proceed, element, style) => {
    switch (style) {
      case 'height':
      case 'width':
        if (!Element.visible(element)) return null;

        var dim = parseInt(proceed(element, style), 10);

        if (dim !== element[`offset${  style.capitalize()}`]) return `${dim  }px`;

        var properties;
        if (style === 'height') {
          properties = ['border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width'];
        } else {
          properties = ['border-left-width', 'padding-left', 'padding-right', 'border-right-width'];
        }
        return (
          `${properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          })  }px`
        );
      default:
        return proceed(element, style);
    }
  });

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap((proceed, element, attribute) => {
    if (attribute === 'title') return element.title;
    return proceed(element, attribute);
  });
} else if (Prototype.Browser.IE) {
  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = style == 'float' || style == 'cssFloat' ? 'styleFloat' : style.camelize();
    let value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if ((value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/)))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && element.getStyle('display') != 'none')
        return `${element[`offset${  style.capitalize()}`]}px`;
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter) {
      return filter.replace(/alpha\([^\)]*\)/gi, '');
    }
    element = $(element);
    let currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) || (!currentStyle && element.style.zoom == 'normal'))
      element.style.zoom = 1;

    let filter = element.getStyle('filter');

      
var style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ? (style.filter = filter) : style.removeAttribute('filter');
      return element;
    }
    if (value < 0.00001) value = 0;
    style.filter = `${stripAlpha(filter)  }alpha(opacity=${  value * 100  })`;
    return element;
  };

  Element._attributeTranslations = (function() {
    let classProp = 'className';

    var forProp = 'for';

    var el = document.createElement('div');

    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          class: classProp,
          className: classProp,
          for: forProp,
          htmlFor: forProp
        },
        values: {
          _getAttr(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode(element, attribute) {
            let node = element.getAttributeNode(attribute);
            return node ? node.value : '';
          },
          _getEv: (function() {
            let el = document.createElement('div');

            var f;
            el.onclick = Prototype.emptyFunction;
            const value = el.getAttribute('onclick');

            if (String(value).indexOf('{') > -1) {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            } else if (value === '') {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          })(),
          _flag(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style(element) {
            return element.style.cssText.toLowerCase();
          },
          title(element) {
            return element.title;
          }
        }
      }
    };
  })();

  Element._attributeTranslations.write = {
    names: Object.extend(
      {
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing'
      },
      Element._attributeTranslations.read.names
    ),
    values: {
      checked(element, value) {
        element.checked = !!value;
      },

      style(element, value) {
        element.style.cssText = value || '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' + 'encType maxLength readOnly longDesc frameBorder').each(
    attr => {
      Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
      Element._attributeTranslations.has[attr.toLowerCase()] = attr;
    }
  );

  (function(v) {
    Object.extend(v, {
      href: v._getAttr2,
      src: v._getAttr2,
      type: v._getAttr,
      action: v._getAttrNode,
      disabled: v._flag,
      checked: v._flag,
      readonly: v._flag,
      multiple: v._flag,
      onload: v._getEv,
      onunload: v._getEv,
      onclick: v._getEv,
      ondblclick: v._getEv,
      onmousedown: v._getEv,
      onmouseup: v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout: v._getEv,
      onfocus: v._getEv,
      onblur: v._getEv,
      onkeypress: v._getEv,
      onkeydown: v._getEv,
      onkeyup: v._getEv,
      onsubmit: v._getEv,
      onreset: v._getEv,
      onselect: v._getEv,
      onchange: v._getEv
    });
  })(Element._attributeTranslations.read.values);

  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function() {
      function _descendants(element) {
        const nodes = element.getElementsByTagName('*');

        var results = [];
        for (var i = 0, node; (node = nodes[i]); i++)
          if (node.tagName !== '!')
            // Filter out comment nodes.
            results.push(node);
        return results;
      }

      Element.Methods.down = function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression)
          ? _descendants(element)[expression]
          : Element.select(element, expression)[index || 0];
      };
    })();
  }
} else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = value == 1 ? 0.999999 : value === '' ? '' : value < 0.00001 ? 0 : value;
    return element;
  };
} else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = value == 1 || value === '' ? '' : value < 0.00001 ? 0 : value;

    if (value == 1)
      if (element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++;
        element.width--;
      } else
        try {
          const n = document.createTextNode(' ');
          element.appendChild(n);
          element.removeChild(n);
        } catch (e) {}

    return element;
  };
}

if ('outerHTML' in document.documentElement) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    const parent = element.parentNode;

    var tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      const nextSibling = element.next();

      var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(node => {
          parent.insertBefore(node, nextSibling);
        });
      else
        fragments.each(node => {
          parent.appendChild(node);
        });
    } else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  const result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html, force) {
  let div = new Element('div');

  var t = Element._insertionTranslations.tags[tagName];

  let workaround = false;
  if (t) workaround = true;
  else if (force) {
    workaround = true;
    t = ['', '', 0];
  }

  if (workaround) {
    div.innerHTML = `&nbsp;${t[0]}${html}${t[1]}`;
    div.removeChild(div.firstChild);
    for (let i = t[2]; i--; ) {
      div = div.firstChild;
    }
  } else {
    div.innerHTML = html;
  }
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom(element, node) {
    element.appendChild(node);
  },
  after(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE: ['<table>', '</table>', 1],
    TBODY: ['<table><tbody>', '</tbody></table>', 2],
    TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
    TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>', '</select>', 1]
  }
};

(function() {
  const tags = Element._insertionTranslations.tags;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH: tags.TD
  });
})();

Element.Methods.Simulated = {
  hasAttribute(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    let node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
};

Element.Methods.ByTag = {};

Object.extend(Element, Element.Methods);

(function(div) {
  if (!Prototype.BrowserFeatures.ElementExtensions && div.__proto__) {
    window.HTMLElement = {};
    window.HTMLElement.prototype = div.__proto__;
    Prototype.BrowserFeatures.ElementExtensions = true;
  }

  div = null;
})(document.createElement('div'));

Element.extend = (function() {
  function checkDeficiency(tagName) {
    if (typeof window.Element !== 'undefined') {
      const proto = window.Element.prototype;
      if (proto) {
        let id = `_${(`${Math.random()  }`).slice(2)}`;

          
let el = document.createElement(tagName);
        proto[id] = 'x';
        const isBuggy = el[id] !== 'x';
        delete proto[id];
        el = null;
        return isBuggy;
      }
    }
    return false;
  }

  function extendElementWith(element, methods) {
    for (const property in methods) {
      const value = methods[property];
      if (Object.isFunction(value) && !(property in element)) element[property] = value.methodize();
    }
  }

  const HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');

  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
      return function(element) {
        if (element && typeof element._extendedByPrototype === 'undefined') {
          const t = element.tagName;
          if (t && /^(?:object|applet|embed)$/i.test(t)) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
          }
        }
        return element;
      };
    }
    return Prototype.K;
  }

  const Methods = {};

  var ByTag = Element.Methods.ByTag;

  const extend = Object.extend(
    element => {
      if (!element || typeof element._extendedByPrototype !== 'undefined' || element.nodeType != 1 || element == window)
        return element;

      let methods = Object.clone(Methods);

        
var tagName = element.tagName.toUpperCase();

      if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

      extendElementWith(element, methods);

      element._extendedByPrototype = Prototype.emptyFunction;
      return element;
    },
    {
      refresh() {
        if (!Prototype.BrowserFeatures.ElementExtensions) {
          Object.extend(Methods, Element.Methods);
          Object.extend(Methods, Element.Methods.Simulated);
        }
      }
    }
  );

  extend.refresh();
  return extend;
})();

if (document.documentElement.hasAttribute) {
  Element.hasAttribute = function(element, attribute) {
    return element.hasAttribute(attribute);
  };
} else {
  Element.hasAttribute = Element.Methods.Simulated.hasAttribute;
}

Element.addMethods = function(methods) {
  const F = Prototype.BrowserFeatures;

  var T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      FORM: Object.clone(Form.Methods),
      INPUT: Object.clone(Form.Element.Methods),
      SELECT: Object.clone(Form.Element.Methods),
      TEXTAREA: Object.clone(Form.Element.Methods),
      BUTTON: Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || {});
  else if (Object.isArray(tagName)) tagName.each(extend);
  else extend(tagName);

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName]) Element.Methods.ByTag[tagName] = {};
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (const property in methods) {
      const value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination)) destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    let klass;
    const trans = {
      OPTGROUP: 'OptGroup',
      TEXTAREA: 'TextArea',
      P: 'Paragraph',
      FIELDSET: 'FieldSet',
      UL: 'UList',
      OL: 'OList',
      DL: 'DList',
      DIR: 'Directory',
      H1: 'Heading',
      H2: 'Heading',
      H3: 'Heading',
      H4: 'Heading',
      H5: 'Heading',
      H6: 'Heading',
      Q: 'Quote',
      INS: 'Mod',
      DEL: 'Mod',
      A: 'Anchor',
      IMG: 'Image',
      CAPTION: 'TableCaption',
      COL: 'TableCol',
      COLGROUP: 'TableCol',
      THEAD: 'TableSection',
      TFOOT: 'TableSection',
      TBODY: 'TableSection',
      TR: 'TableRow',
      TH: 'TableCell',
      TD: 'TableCell',
      FRAMESET: 'FrameSet',
      IFRAME: 'IFrame'
    };
    if (trans[tagName]) klass = `HTML${trans[tagName]}Element`;
    if (window[klass]) return window[klass];
    klass = `HTML${tagName}Element`;
    if (window[klass]) return window[klass];
    klass = `HTML${tagName.capitalize()}Element`;
    if (window[klass]) return window[klass];

    let element = document.createElement(tagName);

    var proto = element.__proto__ || element.constructor.prototype;

    element = null;
    return proto;
  }

  const elementPrototype = window.HTMLElement ? HTMLElement.prototype : Element.prototype;

  if (F.ElementExtensions) {
    copy(Element.Methods, elementPrototype);
    copy(Element.Methods.Simulated, elementPrototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (const tag in Element.Methods.ByTag) {
      const klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = {};
};

document.viewport = {
  getDimensions() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  getScrollOffsets() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    );
  }
};

(function(viewport) {
  const B = Prototype.Browser;

  var doc = document;

  var element;

  var property = {};

  function getRootElement() {
    if (B.WebKit && !doc.evaluate) return document;

    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5) return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = `client${D}`;

    viewport[`get${D}`] = function() {
      return element[property[D]];
    };
    return viewport[`get${D}`]();
  }

  viewport.getWidth = define.curry('Width');

  viewport.getHeight = define.curry('Height');
})(document.viewport);

Element.Storage = {
  UID: 1
};

Element.addMethods({
  getStorage(element) {
    if (!(element = $(element))) return;

    let uid;
    if (element === window) {
      uid = 0;
    } else {
      if (typeof element._prototypeUID === 'undefined') element._prototypeUID = Element.Storage.UID++;
      uid = element._prototypeUID;
    }

    if (!Element.Storage[uid]) Element.Storage[uid] = $H();

    return Element.Storage[uid];
  },

  store(element, key, value) {
    if (!(element = $(element))) return;

    if (arguments.length === 2) {
      Element.getStorage(element).update(key);
    } else {
      Element.getStorage(element).set(key, value);
    }

    return element;
  },

  retrieve(element, key, defaultValue) {
    if (!(element = $(element))) return;
    let hash = Element.getStorage(element);

      
var value = hash.get(key);

    if (Object.isUndefined(value)) {
      hash.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  },

  clone(element, deep) {
    if (!(element = $(element))) return;
    let clone = element.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      let descendants = Element.select(clone, '*');

        
var i = descendants.length;
      while (i--) {
        descendants[i]._prototypeUID = void 0;
      }
    }
    return Element.extend(clone);
  },

  purge(element) {
    if (!(element = $(element))) return;
    let purgeElement = Element._purgeElement;

    purgeElement(element);

    let descendants = element.getElementsByTagName('*');

      
var i = descendants.length;

    while (i--) purgeElement(descendants[i]);

    return null;
  }
});

(function() {
  function toDecimal(pctString) {
    const match = pctString.match(/^(\d+)%?$/i);
    if (!match) return null;
    return Number(match[1]) / 100;
  }

  function getPixelValue(value, property, context) {
    let element = null;
    if (Object.isElement(value)) {
      element = value;
      value = element.getStyle(property);
    }

    if (value === null) {
      return null;
    }

    if (/^(?:-)?\d+(\.\d+)?(px)?$/i.test(value)) {
      return window.parseFloat(value);
    }

    const isPercentage = value.include('%');

    var isViewport = context === document.viewport;

    if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
      const style = element.style.left;

      var rStyle = element.runtimeStyle.left;
      element.runtimeStyle.left = element.currentStyle.left;
      element.style.left = value || 0;
      value = element.style.pixelLeft;
      element.style.left = style;
      element.runtimeStyle.left = rStyle;

      return value;
    }

    if (element && isPercentage) {
      context = context || element.parentNode;
      const decimal = toDecimal(value);
      let whole = null;
      const position = element.getStyle('position');

      const isHorizontal = property.include('left') || property.include('right') || property.include('width');

      const isVertical = property.include('top') || property.include('bottom') || property.include('height');

      if (context === document.viewport) {
        if (isHorizontal) {
          whole = document.viewport.getWidth();
        } else if (isVertical) {
          whole = document.viewport.getHeight();
        }
      } else if (isHorizontal) {
        whole = $(context).measure('width');
      } else if (isVertical) {
        whole = $(context).measure('height');
      }

      return whole === null ? 0 : whole * decimal;
    }

    return 0;
  }

  function toCSSPixels(number) {
    if (Object.isString(number) && number.endsWith('px')) {
      return number;
    }
    return `${number}px`;
  }

  function isDisplayed(element) {
    const originalElement = element;
    while (element && element.parentNode) {
      const display = element.getStyle('display');
      if (display === 'none') {
        return false;
      }
      element = $(element.parentNode);
    }
    return true;
  }

  let hasLayout = Prototype.K;
  if ('currentStyle' in document.documentElement) {
    hasLayout = function(element) {
      if (!element.currentStyle.hasLayout) {
        element.style.zoom = 1;
      }
      return element;
    };
  }

  function cssNameFor(key) {
    if (key.include('border')) key += '-width';
    return key.camelize();
  }

  Element.Layout = Class.create(Hash, {
    initialize($super, element, preCompute) {
      $super();
      this.element = $(element);

      Element.Layout.PROPERTIES.each(function(property) {
        this._set(property, null);
      }, this);

      if (preCompute) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each(this._compute, this);
        this._end();
        this._preComputing = false;
      }
    },

    _set(property, value) {
      return Hash.prototype.set.call(this, property, value);
    },

    set(property, value) {
      throw 'Properties of Element.Layout are read-only.';
    },

    get($super, property) {
      let value = $super(property);
      return value === null ? this._compute(property) : value;
    },

    _begin() {
      if (this._prepared) return;

      let element = this.element;
      if (isDisplayed(element)) {
        this._prepared = true;
        return;
      }

      let originalStyles = {
        position: element.style.position || '',
        width: element.style.width || '',
        visibility: element.style.visibility || '',
        display: element.style.display || ''
      };

      element.store('prototype_original_styles', originalStyles);

      let position = element.getStyle('position');

        
var width = element.getStyle('width');

      if (width === '0px' || width === null) {
        element.style.display = 'block';
        width = element.getStyle('width');
      }

      let context = position === 'fixed' ? document.viewport : element.parentNode;

      element.setStyle({
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
      });

      let positionedWidth = element.getStyle('width');

      let newWidth;
      if (width && positionedWidth === width) {
        newWidth = getPixelValue(element, 'width', context);
      } else if (position === 'absolute' || position === 'fixed') {
        newWidth = getPixelValue(element, 'width', context);
      } else {
        let parent = element.parentNode;

          
var pLayout = $(parent).getLayout();

        newWidth =
          pLayout.get('width') -
          this.get('margin-left') -
          this.get('border-left') -
          this.get('padding-left') -
          this.get('padding-right') -
          this.get('border-right') -
          this.get('margin-right');
      }

      element.setStyle({ width: `${newWidth  }px` });

      this._prepared = true;
    },

    _end() {
      let element = this.element;
      let originalStyles = element.retrieve('prototype_original_styles');
      element.store('prototype_original_styles', null);
      element.setStyle(originalStyles);
      this._prepared = false;
    },

    _compute(property) {
      let COMPUTATIONS = Element.Layout.COMPUTATIONS;
      if (!(property in COMPUTATIONS)) {
        throw 'Property not found.';
      }

      return this._set(property, COMPUTATIONS[property].call(this, this.element));
    },

    toObject() {
      let args = $A(arguments);
      let keys = args.length === 0 ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
      let obj = {};
      keys.each(function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        let value = this.get(key);
        if (value != null) obj[key] = value;
      }, this);
      return obj;
    },

    toHash() {
      let obj = this.toObject.apply(this, arguments);
      return new Hash(obj);
    },

    toCSS() {
      let args = $A(arguments);
      let keys = args.length === 0 ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
      let css = {};

      keys.each(function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;

        let value = this.get(key);
        if (value != null) css[cssNameFor(key)] = `${value  }px`;
      }, this);
      return css;
    },

    inspect() {
      return '#<Element.Layout>';
    }
  });

  Object.extend(Element.Layout, {
    PROPERTIES: $w(
      'height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'
    ),

    COMPOSITE_PROPERTIES: $w(
      'padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'
    ),

    COMPUTATIONS: {
      height(element) {
        if (!this._preComputing) this._begin();

        let bHeight = this.get('border-box-height');
        if (bHeight <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }

        let bTop = this.get('border-top');

          
var bBottom = this.get('border-bottom');

        let pTop = this.get('padding-top');

          
var pBottom = this.get('padding-bottom');

        if (!this._preComputing) this._end();

        return bHeight - bTop - bBottom - pTop - pBottom;
      },

      width(element) {
        if (!this._preComputing) this._begin();

        let bWidth = this.get('border-box-width');
        if (bWidth <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }

        let bLeft = this.get('border-left');

          
var bRight = this.get('border-right');

        let pLeft = this.get('padding-left');

          
var pRight = this.get('padding-right');

        if (!this._preComputing) this._end();

        return bWidth - bLeft - bRight - pLeft - pRight;
      },

      'padding-box-height': function(element) {
        const height = this.get('height');

        var pTop = this.get('padding-top');

        var pBottom = this.get('padding-bottom');

        return height + pTop + pBottom;
      },

      'padding-box-width': function(element) {
        const width = this.get('width');

        var pLeft = this.get('padding-left');

        var pRight = this.get('padding-right');

        return width + pLeft + pRight;
      },

      'border-box-height': function(element) {
        if (!this._preComputing) this._begin();
        const height = element.offsetHeight;
        if (!this._preComputing) this._end();
        return height;
      },

      'border-box-width': function(element) {
        if (!this._preComputing) this._begin();
        const width = element.offsetWidth;
        if (!this._preComputing) this._end();
        return width;
      },

      'margin-box-height': function(element) {
        const bHeight = this.get('border-box-height');

        var mTop = this.get('margin-top');

        var mBottom = this.get('margin-bottom');

        if (bHeight <= 0) return 0;

        return bHeight + mTop + mBottom;
      },

      'margin-box-width': function(element) {
        const bWidth = this.get('border-box-width');

        var mLeft = this.get('margin-left');

        var mRight = this.get('margin-right');

        if (bWidth <= 0) return 0;

        return bWidth + mLeft + mRight;
      },

      top(element) {
        let offset = element.positionedOffset();
        return offset.top;
      },

      bottom(element) {
        let offset = element.positionedOffset();

          
var parent = element.getOffsetParent();

          
var pHeight = parent.measure('height');

        let mHeight = this.get('border-box-height');

        return pHeight - mHeight - offset.top;
      },

      left(element) {
        let offset = element.positionedOffset();
        return offset.left;
      },

      right(element) {
        let offset = element.positionedOffset();

          
var parent = element.getOffsetParent();

          
var pWidth = parent.measure('width');

        let mWidth = this.get('border-box-width');

        return pWidth - mWidth - offset.left;
      },

      'padding-top': function(element) {
        return getPixelValue(element, 'paddingTop');
      },

      'padding-bottom': function(element) {
        return getPixelValue(element, 'paddingBottom');
      },

      'padding-left': function(element) {
        return getPixelValue(element, 'paddingLeft');
      },

      'padding-right': function(element) {
        return getPixelValue(element, 'paddingRight');
      },

      'border-top': function(element) {
        return getPixelValue(element, 'borderTopWidth');
      },

      'border-bottom': function(element) {
        return getPixelValue(element, 'borderBottomWidth');
      },

      'border-left': function(element) {
        return getPixelValue(element, 'borderLeftWidth');
      },

      'border-right': function(element) {
        return getPixelValue(element, 'borderRightWidth');
      },

      'margin-top': function(element) {
        return getPixelValue(element, 'marginTop');
      },

      'margin-bottom': function(element) {
        return getPixelValue(element, 'marginBottom');
      },

      'margin-left': function(element) {
        return getPixelValue(element, 'marginLeft');
      },

      'margin-right': function(element) {
        return getPixelValue(element, 'marginRight');
      }
    }
  });

  if ('getBoundingClientRect' in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      right(element) {
        let parent = hasLayout(element.getOffsetParent());
        let rect = element.getBoundingClientRect();

          
var pRect = parent.getBoundingClientRect();

        return (pRect.right - rect.right).round();
      },

      bottom(element) {
        let parent = hasLayout(element.getOffsetParent());
        let rect = element.getBoundingClientRect();

          
var pRect = parent.getBoundingClientRect();

        return (pRect.bottom - rect.bottom).round();
      }
    });
  }

  Element.Offset = Class.create({
    initialize(left, top) {
      this.left = left.round();
      this.top = top.round();

      this[0] = this.left;
      this[1] = this.top;
    },

    relativeTo(offset) {
      return new Element.Offset(this.left - offset.left, this.top - offset.top);
    },

    inspect() {
      return '#<Element.Offset left: #{left} top: #{top}>'.interpolate(this);
    },

    toString() {
      return '[#{left}, #{top}]'.interpolate(this);
    },

    toArray() {
      return [this.left, this.top];
    }
  });

  function getLayout(element, preCompute) {
    return new Element.Layout(element, preCompute);
  }

  function measure(element, property) {
    return $(element)
      .getLayout()
      .get(property);
  }

  function getDimensions(element) {
    element = $(element);
    const display = Element.getStyle(element, 'display');

    if (display && display !== 'none') {
      return { width: element.offsetWidth, height: element.offsetHeight };
    }

    const style = element.style;
    const originalStyles = {
      visibility: style.visibility,
      position: style.position,
      display: style.display
    };

    const newStyles = {
      visibility: 'hidden',
      display: 'block'
    };

    if (originalStyles.position !== 'fixed') newStyles.position = 'absolute';

    Element.setStyle(element, newStyles);

    const dimensions = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };

    Element.setStyle(element, originalStyles);

    return dimensions;
  }

  function getOffsetParent(element) {
    element = $(element);

    if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element)) return $(document.body);

    const isInline = Element.getStyle(element, 'display') === 'inline';
    if (!isInline && element.offsetParent) return $(element.offsetParent);

    while ((element = element.parentNode) && element !== document.body) {
      if (Element.getStyle(element, 'position') !== 'static') {
        return isHtml(element) ? $(document.body) : $(element);
      }
    }

    return $(document.body);
  }

  function cumulativeOffset(element) {
    element = $(element);
    let valueT = 0;

    var valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return new Element.Offset(valueL, valueT);
  }

  function positionedOffset(element) {
    element = $(element);

    const layout = element.getLayout();

    let valueT = 0;

    var valueL = 0;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (isBody(element)) break;
        const p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);

    valueL -= layout.get('margin-top');
    valueT -= layout.get('margin-left');

    return new Element.Offset(valueL, valueT);
  }

  function cumulativeScrollOffset(element) {
    let valueT = 0;

    var valueL = 0;
    do {
      valueT += element.scrollTop || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return new Element.Offset(valueL, valueT);
  }

  function viewportOffset(forElement) {
    element = $(element);
    let valueT = 0;

    var valueL = 0;

    var docBody = document.body;

    var element = forElement;
    do {
      valueT += element.offsetTop || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == docBody && Element.getStyle(element, 'position') == 'absolute') break;
    } while ((element = element.offsetParent));

    element = forElement;
    do {
      if (element != docBody) {
        valueT -= element.scrollTop || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while ((element = element.parentNode));
    return new Element.Offset(valueL, valueT);
  }

  function absolutize(element) {
    element = $(element);

    if (Element.getStyle(element, 'position') === 'absolute') {
      return element;
    }

    const offsetParent = getOffsetParent(element);
    const eOffset = element.viewportOffset();

    var pOffset = offsetParent.viewportOffset();

    const offset = eOffset.relativeTo(pOffset);
    const layout = element.getLayout();

    element.store('prototype_absolutize_original_styles', {
      left: element.getStyle('left'),
      top: element.getStyle('top'),
      width: element.getStyle('width'),
      height: element.getStyle('height')
    });

    element.setStyle({
      position: 'absolute',
      top: `${offset.top}px`,
      left: `${offset.left}px`,
      width: `${layout.get('width')}px`,
      height: `${layout.get('height')}px`
    });

    return element;
  }

  function relativize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') === 'relative') {
      return element;
    }

    const originalStyles = element.retrieve('prototype_absolutize_original_styles');

    if (originalStyles) element.setStyle(originalStyles);
    return element;
  }

  if (Prototype.Browser.IE) {
    getOffsetParent = getOffsetParent.wrap((proceed, element) => {
      element = $(element);

      if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element)) return $(document.body);

      let position = element.getStyle('position');
      if (position !== 'static') return proceed(element);

      element.setStyle({ position: 'relative' });
      let value = proceed(element);
      element.setStyle({ position });
      return value;
    });

    positionedOffset = positionedOffset.wrap((proceed, element) => {
      element = $(element);
      if (!element.parentNode) return new Element.Offset(0, 0);
      let position = element.getStyle('position');
      if (position !== 'static') return proceed(element);

      let offsetParent = element.getOffsetParent();
      if (offsetParent && offsetParent.getStyle('position') === 'fixed') hasLayout(offsetParent);

      element.setStyle({ position: 'relative' });
      let value = proceed(element);
      element.setStyle({ position });
      return value;
    });
  } else if (Prototype.Browser.Webkit) {
    cumulativeOffset = function(element) {
      element = $(element);
      let valueT = 0;

      var valueL = 0;
      do {
        valueT += element.offsetTop || 0;
        valueL += element.offsetLeft || 0;
        if (element.offsetParent == document.body) if (Element.getStyle(element, 'position') == 'absolute') break;

        element = element.offsetParent;
      } while (element);

      return new Element.Offset(valueL, valueT);
    };
  }

  Element.addMethods({
    getLayout,
    measure,
    getDimensions,
    getOffsetParent,
    cumulativeOffset,
    positionedOffset,
    cumulativeScrollOffset,
    viewportOffset,
    absolutize,
    relativize
  });

  function isBody(element) {
    return element.nodeName.toUpperCase() === 'BODY';
  }

  function isHtml(element) {
    return element.nodeName.toUpperCase() === 'HTML';
  }

  function isDocument(element) {
    return element.nodeType === Node.DOCUMENT_NODE;
  }

  function isDetached(element) {
    return element !== document.body && !Element.descendantOf(element, document.body);
  }

  if ('getBoundingClientRect' in document.documentElement) {
    Element.addMethods({
      viewportOffset(element) {
        element = $(element);
        if (isDetached(element)) return new Element.Offset(0, 0);

        let rect = element.getBoundingClientRect();

          
var docEl = document.documentElement;
        return new Element.Offset(rect.left - docEl.clientLeft, rect.top - docEl.clientTop);
      }
    });
  }
})();
window.$$ = function() {
  const expression = $A(arguments).join(', ');
  return Prototype.Selector.select(expression, document);
};

Prototype.Selector = (function() {
  function select() {
    throw new Error('Method "Prototype.Selector.select" must be defined.');
  }

  function match() {
    throw new Error('Method "Prototype.Selector.match" must be defined.');
  }

  function find(elements, expression, index) {
    index = index || 0;
    const match = Prototype.Selector.match;

    var length = elements.length;

    var matchIndex = 0;

    var i;

    for (i = 0; i < length; i++) {
      if (match(elements[i], expression) && index == matchIndex++) {
        return Element.extend(elements[i]);
      }
    }
  }

  function extendElements(elements) {
    for (let i = 0, length = elements.length; i < length; i++) {
      Element.extend(elements[i]);
    }
    return elements;
  }

  const K = Prototype.K;

  return {
    select,
    match,
    find,
    extendElements: Element.extend === K ? K : extendElements,
    extendElement: Element.extend
  };
})();
Prototype._original_property = window.Sizzle;
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function() {
  const chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;

  var done = 0;

  var toString = Object.prototype.toString;

  var hasDuplicate = false;

  var baseHasDuplicate = true;

  [0, 0].sort(() => {
    baseHasDuplicate = false;
    return 0;
  });

  var Sizzle = function(selector, context, results, seed) {
    results = results || [];
    const origContext = (context = context || document);

    if (context.nodeType !== 1 && context.nodeType !== 9) {
      return [];
    }

    if (!selector || typeof selector !== 'string') {
      return results;
    }

    let parts = [];

    var m;

    var set;

    var checkSet;

    var check;

    var mode;

    var extra;

    var prune = true;

    var contextXML = isXML(context);

    var soFar = selector;

    while ((chunker.exec(''), (m = chunker.exec(soFar))) !== null) {
      soFar = m[3];

      parts.push(m[1]);

      if (m[2]) {
        extra = m[3];
        break;
      }
    }

    if (parts.length > 1 && origPOS.exec(selector)) {
      if (parts.length === 2 && Expr.relative[parts[0]]) {
        set = posProcess(parts[0] + parts[1], context);
      } else {
        set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

        while (parts.length) {
          selector = parts.shift();

          if (Expr.relative[selector]) selector += parts.shift();

          set = posProcess(selector, set);
        }
      }
    } else {
      if (
        !seed &&
        parts.length > 1 &&
        context.nodeType === 9 &&
        !contextXML &&
        Expr.match.ID.test(parts[0]) &&
        !Expr.match.ID.test(parts[parts.length - 1])
      ) {
        var ret = Sizzle.find(parts.shift(), context, contextXML);
        context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
      }

      if (context) {
        var ret = seed
          ? { expr: parts.pop(), set: makeArray(seed) }
          : Sizzle.find(
              parts.pop(),
              parts.length === 1 && (parts[0] === '~' || parts[0] === '+') && context.parentNode
                ? context.parentNode
                : context,
              contextXML
            );
        set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

        if (parts.length > 0) {
          checkSet = makeArray(set);
        } else {
          prune = false;
        }

        while (parts.length) {
          var cur = parts.pop();

          var pop = cur;

          if (!Expr.relative[cur]) {
            cur = '';
          } else {
            pop = parts.pop();
          }

          if (pop == null) {
            pop = context;
          }

          Expr.relative[cur](checkSet, pop, contextXML);
        }
      } else {
        checkSet = parts = [];
      }
    }

    if (!checkSet) {
      checkSet = set;
    }

    if (!checkSet) {
      throw `Syntax error, unrecognized expression: ${cur || selector}`;
    }

    if (toString.call(checkSet) === '[object Array]') {
      if (!prune) {
        results.push(...checkSet);
      } else if (context && context.nodeType === 1) {
        for (var i = 0; checkSet[i] != null; i++) {
          if (checkSet[i] && (checkSet[i] === true || (checkSet[i].nodeType === 1 && contains(context, checkSet[i])))) {
            results.push(set[i]);
          }
        }
      } else {
        for (var i = 0; checkSet[i] != null; i++) {
          if (checkSet[i] && checkSet[i].nodeType === 1) {
            results.push(set[i]);
          }
        }
      }
    } else {
      makeArray(checkSet, results);
    }

    if (extra) {
      Sizzle(extra, origContext, results, seed);
      Sizzle.uniqueSort(results);
    }

    return results;
  };

  Sizzle.uniqueSort = function(results) {
    if (sortOrder) {
      hasDuplicate = baseHasDuplicate;
      results.sort(sortOrder);

      if (hasDuplicate) {
        for (let i = 1; i < results.length; i++) {
          if (results[i] === results[i - 1]) {
            results.splice(i--, 1);
          }
        }
      }
    }

    return results;
  };

  Sizzle.matches = function(expr, set) {
    return Sizzle(expr, null, null, set);
  };

  Sizzle.find = function(expr, context, isXML) {
    let set;
    var match;

    if (!expr) {
      return [];
    }

    for (let i = 0, l = Expr.order.length; i < l; i++) {
      let type = Expr.order[i];

      var match;

      if ((match = Expr.leftMatch[type].exec(expr))) {
        const left = match[1];
        match.splice(1, 1);

        if (left.substr(left.length - 1) !== '\\') {
          match[1] = (match[1] || '').replace(/\\/g, '');
          set = Expr.find[type](match, context, isXML);
          if (set != null) {
            expr = expr.replace(Expr.match[type], '');
            break;
          }
        }
      }
    }

    if (!set) {
      set = context.getElementsByTagName('*');
    }

    return { set, expr };
  };

  Sizzle.filter = function(expr, set, inplace, not) {
    let old = expr;

    var result = [];

    var curLoop = set;

    var match;

    var anyFound;

    var isXMLFilter = set && set[0] && isXML(set[0]);

    while (expr && set.length) {
      for (const type in Expr.filter) {
        if ((match = Expr.match[type].exec(expr)) != null) {
          let filter = Expr.filter[type];

          var found;

          var item;
          anyFound = false;

          if (curLoop == result) {
            result = [];
          }

          if (Expr.preFilter[type]) {
            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

            if (!match) {
              anyFound = found = true;
            } else if (match === true) {
              continue;
            }
          }

          if (match) {
            for (let i = 0; (item = curLoop[i]) != null; i++) {
              if (item) {
                found = filter(item, match, i, curLoop);
                const pass = not ^ !!found;

                if (inplace && found != null) {
                  if (pass) {
                    anyFound = true;
                  } else {
                    curLoop[i] = false;
                  }
                } else if (pass) {
                  result.push(item);
                  anyFound = true;
                }
              }
            }
          }

          if (found !== undefined) {
            if (!inplace) {
              curLoop = result;
            }

            expr = expr.replace(Expr.match[type], '');

            if (!anyFound) {
              return [];
            }

            break;
          }
        }
      }

      if (expr == old) {
        if (anyFound == null) {
          throw `Syntax error, unrecognized expression: ${expr}`;
        } else {
          break;
        }
      }

      old = expr;
    }

    return curLoop;
  };

  var Expr = (Sizzle.selectors = {
    order: ['ID', 'NAME', 'TAG'],
    match: {
      ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
      CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
      NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
      ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
      TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
      CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
      POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
      PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
    },
    leftMatch: {},
    attrMap: {
      class: 'className',
      for: 'htmlFor'
    },
    attrHandle: {
      href(elem) {
        return elem.getAttribute('href');
      }
    },
    relative: {
      '+': function(checkSet, part, isXML) {
        const isPartStr = typeof part === 'string';

        var isTag = isPartStr && !/\W/.test(part);

        var isPartStrNotTag = isPartStr && !isTag;

        if (isTag && !isXML) {
          part = part.toUpperCase();
        }

        for (var i = 0, l = checkSet.length, elem; i < l; i++) {
          if ((elem = checkSet[i])) {
            while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}

            checkSet[i] = isPartStrNotTag || (elem && elem.nodeName === part) ? elem || false : elem === part;
          }
        }

        if (isPartStrNotTag) {
          Sizzle.filter(part, checkSet, true);
        }
      },
      '>': function(checkSet, part, isXML) {
        const isPartStr = typeof part === 'string';

        if (isPartStr && !/\W/.test(part)) {
          part = isXML ? part : part.toUpperCase();

          for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
              const parent = elem.parentNode;
              checkSet[i] = parent.nodeName === part ? parent : false;
            }
          }
        } else {
          for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
              checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
            }
          }

          if (isPartStr) {
            Sizzle.filter(part, checkSet, true);
          }
        }
      },
      '': function(checkSet, part, isXML) {
        const doneName = done++;

        var checkFn = dirCheck;

        if (!/\W/.test(part)) {
          var nodeCheck = (part = isXML ? part : part.toUpperCase());
          checkFn = dirNodeCheck;
        }

        checkFn('parentNode', part, doneName, checkSet, nodeCheck, isXML);
      },
      '~': function(checkSet, part, isXML) {
        const doneName = done++;

        var checkFn = dirCheck;

        if (typeof part === 'string' && !/\W/.test(part)) {
          var nodeCheck = (part = isXML ? part : part.toUpperCase());
          checkFn = dirNodeCheck;
        }

        checkFn('previousSibling', part, doneName, checkSet, nodeCheck, isXML);
      }
    },
    find: {
      ID(match, context, isXML) {
        if (typeof context.getElementById !== 'undefined' && !isXML) {
          let m = context.getElementById(match[1]);
          return m ? [m] : [];
        }
      },
      NAME(match, context, isXML) {
        if (typeof context.getElementsByName !== 'undefined') {
          let ret = [];

            
var results = context.getElementsByName(match[1]);

          for (let i = 0, l = results.length; i < l; i++) {
            if (results[i].getAttribute('name') === match[1]) {
              ret.push(results[i]);
            }
          }

          return ret.length === 0 ? null : ret;
        }
      },
      TAG(match, context) {
        return context.getElementsByTagName(match[1]);
      }
    },
    preFilter: {
      CLASS(match, curLoop, inplace, result, not, isXML) {
        match = ` ${  match[1].replace(/\\/g, '')  } `;

        if (isXML) {
          return match;
        }

        for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
          if (elem) {
            if (not ^ (elem.className && (` ${  elem.className  } `).indexOf(match) >= 0)) {
              if (!inplace) result.push(elem);
            } else if (inplace) {
              curLoop[i] = false;
            }
          }
        }

        return false;
      },
      ID(match) {
        return match[1].replace(/\\/g, '');
      },
      TAG(match, curLoop) {
        for (var i = 0; curLoop[i] === false; i++) {}
        return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
      },
      CHILD(match) {
        if (match[1] == 'nth') {
          let test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
            (match[2] == 'even' && '2n') ||
              (match[2] == 'odd' && '2n+1') ||
              (!/\D/.test(match[2]) && `0n+${  match[2]}`) ||
              match[2]
          );

          match[2] = test[1] + (test[2] || 1) - 0;
          match[3] = test[3] - 0;
        }

        match[0] = done++;

        return match;
      },
      ATTR(match, curLoop, inplace, result, not, isXML) {
        let name = match[1].replace(/\\/g, '');

        if (!isXML && Expr.attrMap[name]) {
          match[1] = Expr.attrMap[name];
        }

        if (match[2] === '~=') {
          match[4] = ` ${  match[4]  } `;
        }

        return match;
      },
      PSEUDO(match, curLoop, inplace, result, not) {
        if (match[1] === 'not') {
          if ((chunker.exec(match[3]) || '').length > 1 || /^\w/.test(match[3])) {
            match[3] = Sizzle(match[3], null, null, curLoop);
          } else {
            let ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
            if (!inplace) {
              result.push(...ret);
            }
            return false;
          }
        } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
          return true;
        }

        return match;
      },
      POS(match) {
        match.unshift(true);
        return match;
      }
    },
    filters: {
      enabled(elem) {
        return elem.disabled === false && elem.type !== 'hidden';
      },
      disabled(elem) {
        return elem.disabled === true;
      },
      checked(elem) {
        return elem.checked === true;
      },
      selected(elem) {
        elem.parentNode.selectedIndex;
        return elem.selected === true;
      },
      parent(elem) {
        return !!elem.firstChild;
      },
      empty(elem) {
        return !elem.firstChild;
      },
      has(elem, i, match) {
        return !!Sizzle(match[3], elem).length;
      },
      header(elem) {
        return /h\d/i.test(elem.nodeName);
      },
      text(elem) {
        return elem.type === 'text';
      },
      radio(elem) {
        return elem.type === 'radio';
      },
      checkbox(elem) {
        return elem.type === 'checkbox';
      },
      file(elem) {
        return elem.type === 'file';
      },
      password(elem) {
        return elem.type === 'password';
      },
      submit(elem) {
        return elem.type === 'submit';
      },
      image(elem) {
        return elem.type === 'image';
      },
      reset(elem) {
        return elem.type === 'reset';
      },
      button(elem) {
        return elem.type === 'button' || elem.nodeName.toUpperCase() === 'BUTTON';
      },
      input(elem) {
        return /input|select|textarea|button/i.test(elem.nodeName);
      }
    },
    setFilters: {
      first(elem, i) {
        return i === 0;
      },
      last(elem, i, match, array) {
        return i === array.length - 1;
      },
      even(elem, i) {
        return i % 2 === 0;
      },
      odd(elem, i) {
        return i % 2 === 1;
      },
      lt(elem, i, match) {
        return i < match[3] - 0;
      },
      gt(elem, i, match) {
        return i > match[3] - 0;
      },
      nth(elem, i, match) {
        return match[3] - 0 == i;
      },
      eq(elem, i, match) {
        return match[3] - 0 == i;
      }
    },
    filter: {
      PSEUDO(elem, match, i, array) {
        var name = match[1],
          filter = Expr.filters[name];

        if (filter) {
          return filter(elem, i, match, array);
        } if (name === 'contains') {
          return (elem.textContent || elem.innerText || '').indexOf(match[3]) >= 0;
        } else if (name === 'not') {
          var not = match[3];

          for (var i = 0, l = not.length; i < l; i++) {
            if (not[i] === elem) {
              return false;
            }
          }

          return true;
        }
      },
      CHILD(elem, match) {
        var type = match[1],
          node = elem;
        switch (type) {
          case 'only':
          case 'first':
            while ((node = node.previousSibling)) {
              if (node.nodeType === 1) return false;
            }
            if (type == 'first') return true;
            node = elem;
          case 'last':
            while ((node = node.nextSibling)) {
              if (node.nodeType === 1) return false;
            }
            return true;
          case 'nth':
            var first = match[2],
              last = match[3];

            if (first == 1 && last == 0) {
              return true;
            }

            var doneName = match[0],
              parent = elem.parentNode;

            if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
              var count = 0;
              for (node = parent.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === 1) {
                  node.nodeIndex = ++count;
                }
              }
              parent.sizcache = doneName;
            }

            var diff = elem.nodeIndex - last;
            if (first == 0) {
              return diff == 0;
            } 
              return diff % first == 0 && diff / first >= 0;
            
        }
      },
      ID(elem, match) {
        return elem.nodeType === 1 && elem.getAttribute('id') === match;
      },
      TAG(elem, match) {
        return (match === '*' && elem.nodeType === 1) || elem.nodeName === match;
      },
      CLASS(elem, match) {
        return (` ${  elem.className || elem.getAttribute('class')  } `).indexOf(match) > -1;
      },
      ATTR(elem, match) {
        let name = match[1];

          
var result = Expr.attrHandle[name]
            ? Expr.attrHandle[name](elem)
            : elem[name] != null
              ? elem[name]
              : elem.getAttribute(name);

          
var value = result + '';

          
var type = match[2];

          
var check = match[4];

        return result == null
          ? type === '!='
          : type === '='
            ? value === check
            : type === '*='
              ? value.indexOf(check) >= 0
              : type === '~='
                ? (` ${  value  } `).indexOf(check) >= 0
                : !check
                  ? value && result !== false
                  : type === '!='
                    ? value != check
                    : type === '^='
                      ? value.indexOf(check) === 0
                      : type === '$='
                        ? value.substr(value.length - check.length) === check
                        : type === '|='
                          ? value === check || value.substr(0, check.length + 1) === `${check  }-`
                          : false;
      },
      POS(elem, match, i, array) {
        let name = match[2];

          
var filter = Expr.setFilters[name];

        if (filter) {
          return filter(elem, i, match, array);
        }
      }
    }
  });

  var origPOS = Expr.match.POS;

  for (const type in Expr.match) {
    Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
    Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source);
  }

  var makeArray = function(array, results) {
    array = Array.prototype.slice.call(array, 0);

    if (results) {
      results.push(...array);
      return results;
    }

    return array;
  };

  try {
    Array.prototype.slice.call(document.documentElement.childNodes, 0);
  } catch (e) {
    makeArray = function(array, results) {
      const ret = results || [];

      if (toString.call(array) === '[object Array]') {
        Array.prototype.push.apply(ret, array);
      } else if (typeof array.length === 'number') {
        for (var i = 0, l = array.length; i < l; i++) {
          ret.push(array[i]);
        }
      } else {
        for (var i = 0; array[i]; i++) {
          ret.push(array[i]);
        }
      }

      return ret;
    };
  }

  let sortOrder;

  if (document.documentElement.compareDocumentPosition) {
    sortOrder = function(a, b) {
      if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
        if (a == b) {
          hasDuplicate = true;
        }
        return 0;
      }

      const ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
      if (ret === 0) {
        hasDuplicate = true;
      }
      return ret;
    };
  } else if ('sourceIndex' in document.documentElement) {
    sortOrder = function(a, b) {
      if (!a.sourceIndex || !b.sourceIndex) {
        if (a == b) {
          hasDuplicate = true;
        }
        return 0;
      }

      const ret = a.sourceIndex - b.sourceIndex;
      if (ret === 0) {
        hasDuplicate = true;
      }
      return ret;
    };
  } else if (document.createRange) {
    sortOrder = function(a, b) {
      if (!a.ownerDocument || !b.ownerDocument) {
        if (a == b) {
          hasDuplicate = true;
        }
        return 0;
      }

      const aRange = a.ownerDocument.createRange();

      var bRange = b.ownerDocument.createRange();
      aRange.setStart(a, 0);
      aRange.setEnd(a, 0);
      bRange.setStart(b, 0);
      bRange.setEnd(b, 0);
      const ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
      if (ret === 0) {
        hasDuplicate = true;
      }
      return ret;
    };
  }

  (function() {
    let form = document.createElement('div');

    var id = `script${new Date().getTime()}`;
    form.innerHTML = `<a name='${id}'/>`;

    let root = document.documentElement;
    root.insertBefore(form, root.firstChild);

    if (document.getElementById(id)) {
      Expr.find.ID = function(match, context, isXML) {
        if (typeof context.getElementById !== 'undefined' && !isXML) {
          const m = context.getElementById(match[1]);
          return m
            ? m.id === match[1] ||
              (typeof m.getAttributeNode !== 'undefined' && m.getAttributeNode('id').nodeValue === match[1])
              ? [m]
              : undefined
            : [];
        }
      };

      Expr.filter.ID = function(elem, match) {
        const node = typeof elem.getAttributeNode !== 'undefined' && elem.getAttributeNode('id');
        return elem.nodeType === 1 && node && node.nodeValue === match;
      };
    }

    root.removeChild(form);
    root = form = null; // release memory in IE
  })();

  (function() {
    let div = document.createElement('div');
    div.appendChild(document.createComment(''));

    if (div.getElementsByTagName('*').length > 0) {
      Expr.find.TAG = function(match, context) {
        let results = context.getElementsByTagName(match[1]);

        if (match[1] === '*') {
          const tmp = [];

          for (let i = 0; results[i]; i++) {
            if (results[i].nodeType === 1) {
              tmp.push(results[i]);
            }
          }

          results = tmp;
        }

        return results;
      };
    }

    div.innerHTML = "<a href='#'></a>";
    if (
      div.firstChild &&
      typeof div.firstChild.getAttribute !== 'undefined' &&
      div.firstChild.getAttribute('href') !== '#'
    ) {
      Expr.attrHandle.href = function(elem) {
        return elem.getAttribute('href', 2);
      };
    }

    div = null; // release memory in IE
  })();

  if (document.querySelectorAll)
    (function() {
      const oldSizzle = Sizzle;

      var div = document.createElement('div');
      div.innerHTML = "<p class='TEST'></p>";

      if (div.querySelectorAll && div.querySelectorAll('.TEST').length === 0) {
        return;
      }

      Sizzle = function(query, context, extra, seed) {
        context = context || document;

        if (!seed && context.nodeType === 9 && !isXML(context)) {
          try {
            return makeArray(context.querySelectorAll(query), extra);
          } catch (e) {}
        }

        return oldSizzle(query, context, extra, seed);
      };

      for (const prop in oldSizzle) {
        Sizzle[prop] = oldSizzle[prop];
      }

      div = null; // release memory in IE
    })();

  if (document.getElementsByClassName && document.documentElement.getElementsByClassName)
    (function() {
      let div = document.createElement('div');
      div.innerHTML = "<div class='test e'></div><div class='test'></div>";

      if (div.getElementsByClassName('e').length === 0) return;

      div.lastChild.className = 'e';

      if (div.getElementsByClassName('e').length === 1) return;

      Expr.order.splice(1, 0, 'CLASS');
      Expr.find.CLASS = function(match, context, isXML) {
        if (typeof context.getElementsByClassName !== 'undefined' && !isXML) {
          return context.getElementsByClassName(match[1]);
        }
      };

      div = null; // release memory in IE
    })();

  function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    const sibDir = dir == 'previousSibling' && !isXML;
    for (let i = 0, l = checkSet.length; i < l; i++) {
      let elem = checkSet[i];
      if (elem) {
        if (sibDir && elem.nodeType === 1) {
          elem.sizcache = doneName;
          elem.sizset = i;
        }
        elem = elem[dir];
        let match = false;

        while (elem) {
          if (elem.sizcache === doneName) {
            match = checkSet[elem.sizset];
            break;
          }

          if (elem.nodeType === 1 && !isXML) {
            elem.sizcache = doneName;
            elem.sizset = i;
          }

          if (elem.nodeName === cur) {
            match = elem;
            break;
          }

          elem = elem[dir];
        }

        checkSet[i] = match;
      }
    }
  }

  function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    const sibDir = dir == 'previousSibling' && !isXML;
    for (let i = 0, l = checkSet.length; i < l; i++) {
      let elem = checkSet[i];
      if (elem) {
        if (sibDir && elem.nodeType === 1) {
          elem.sizcache = doneName;
          elem.sizset = i;
        }
        elem = elem[dir];
        let match = false;

        while (elem) {
          if (elem.sizcache === doneName) {
            match = checkSet[elem.sizset];
            break;
          }

          if (elem.nodeType === 1) {
            if (!isXML) {
              elem.sizcache = doneName;
              elem.sizset = i;
            }
            if (typeof cur !== 'string') {
              if (elem === cur) {
                match = true;
                break;
              }
            } else if (Sizzle.filter(cur, [elem]).length > 0) {
              match = elem;
              break;
            }
          }

          elem = elem[dir];
        }

        checkSet[i] = match;
      }
    }
  }

  var contains = document.compareDocumentPosition
    ? function(a, b) {
        return a.compareDocumentPosition(b) & 16;
      }
    : function(a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
      };

  var isXML = function(elem) {
    return (
      (elem.nodeType === 9 && elem.documentElement.nodeName !== 'HTML') ||
      (!!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== 'HTML')
    );
  };

  var posProcess = function(selector, context) {
    const tmpSet = [];

    var later = '';

    var match;

    var root = context.nodeType ? [context] : context;

    while ((match = Expr.match.PSEUDO.exec(selector))) {
      later += match[0];
      selector = selector.replace(Expr.match.PSEUDO, '');
    }

    selector = Expr.relative[selector] ? `${selector}*` : selector;

    for (let i = 0, l = root.length; i < l; i++) {
      Sizzle(selector, root[i], tmpSet);
    }

    return Sizzle.filter(later, tmpSet);
  };

  window.Sizzle = Sizzle;
})();

(function(engine) {
  const extendElements = Prototype.Selector.extendElements;

  function select(selector, scope) {
    return extendElements(engine(selector, scope || document));
  }

  function match(element, selector) {
    return engine.matches(selector, [element]).length == 1;
  }

  Prototype.Selector.engine = engine;
  Prototype.Selector.select = select;
  Prototype.Selector.match = match;
})(Sizzle);

window.Sizzle = Prototype._original_property;
delete Prototype._original_property;

var Form = {
  reset(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements(elements, options) {
    if (typeof options !== 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    let key;

      
var value;

      
var submitted = false;

      
var submit = options.submit;

      
var accumulator;

      
var initial;

    if (options.hash) {
      initial = {};
      accumulator = function(result, key, value) {
        if (key in result) {
          if (!Object.isArray(result[key])) result[key] = [result[key]];
          result[key].push(value);
        } else result[key] = value;
        return result;
      };
    } else {
      initial = '';
      accumulator = function(result, key, value) {
        return `${result + (result ? '&' : '') + encodeURIComponent(key)  }=${  encodeURIComponent(value)}`;
      };
    }

    return elements.inject(initial, (result, element) => {
      if (!element.disabled && element.name) {
        key = element.name;
        value = $(element).getValue();
        if (
          value != null &&
          element.type != 'file' &&
          (element.type != 'submit' ||
            (!submitted && submit !== false && (!submit || key == submit) && (submitted = true)))
        ) {
          result = accumulator(result, key, value);
        }
      }
      return result;
    });
  }
};

Form.Methods = {
  serialize(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements(form) {
    let elements = $(form).getElementsByTagName('*');

      
var element;

      
var arr = [];

      
var serializers = Form.Element.Serializers;
    for (let i = 0; (element = elements[i]); i++) {
      arr.push(element);
    }
    return arr.inject([], (elements, child) => {
      if (serializers[child.tagName.toLowerCase()]) elements.push(Element.extend(child));
      return elements;
    });
  },

  getInputs(form, typeName, name) {
    form = $(form);
    let inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      let input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name)) continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement(form) {
    let elements = $(form)
      .getElements()
      .findAll((element) => {
        return 'hidden' != element.type && !element.disabled;
      });
    let firstByIndex = elements
      .findAll((element) => {
        return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
      })
      .sortBy((element) => {
        return element.tabIndex;
      })
      .first();

    return firstByIndex || elements.find(function(element) {
          return /^(?:input|select|textarea)$/i.test(element.tagName);
        });
  },

  focusFirstElement(form) {
    form = $(form);
    let element = form.findFirstElement();
    if (element) element.activate();
    return form;
  },

  request(form, options) {
    (form = $(form)), (options = Object.clone(options || {}));

    let params = options.parameters;

      
var action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method) options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus(element) {
    $(element).focus();
    return element;
  },

  select(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {
  serialize(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      let value = element.getValue();
      if (value != undefined) {
        let pair = {};
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue(element) {
    element = $(element);
    let method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue(element, value) {
    element = $(element);
    let method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear(element) {
    $(element).value = '';
    return element;
  },

  present(element) {
    return $(element).value != '';
  },

  activate(element) {
    element = $(element);
    try {
      element.focus();
      if (
        element.select &&
        (element.tagName.toLowerCase() != 'input' || !/^(?:button|reset|submit)$/i.test(element.type))
      )
        element.select();
    } catch (e) {}
    return element;
  },

  disable(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

const Field = Form.Element;

const $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = (function() {
  function input(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return inputSelector(element, value);
      default:
        return valueSelector(element, value);
    }
  }

  function inputSelector(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    element.checked = !!value;
  }

  function valueSelector(element, value) {
    if (Object.isUndefined(value)) return element.value;
    element.value = value;
  }

  function select(element, value) {
    if (Object.isUndefined(value)) return (element.type === 'select-one' ? selectOne : selectMany)(element);

    let opt;

    var currentValue;

    var single = !Object.isArray(value);
    for (let i = 0, length = element.length; i < length; i++) {
      opt = element.options[i];
      currentValue = this.optionValue(opt);
      if (single) {
        if (currentValue == value) {
          opt.selected = true;
          return;
        }
      } else opt.selected = value.include(currentValue);
    }
  }

  function selectOne(element) {
    const index = element.selectedIndex;
    return index >= 0 ? optionValue(element.options[index]) : null;
  }

  function selectMany(element) {
    var values;

    var length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      const opt = element.options[i];
      if (opt.selected) values.push(optionValue(opt));
    }
    return values;
  }

  function optionValue(opt) {
    return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
  }

  return {
    input,
    inputSelector,
    textarea: valueSelector,
    select,
    selectOne,
    selectMany,
    optionValue,
    button: valueSelector
  };
})();

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element = $(element);
    this.lastValue = this.getValue();
  },

  execute() {
    let value = this.getValue();
    if (
      Object.isString(this.lastValue) && Object.isString(value)
        ? this.lastValue != value
        : String(this.lastValue) != String(value)
    ) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize(element, callback) {
    this.element = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form') this.registerFormCallbacks();
    else this.registerCallback(this.element);
  },

  onElementEvent() {
    let value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue() {
    return Form.serialize(this.element);
  }
});
(function() {
  const Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT: 45,

    cache: {}
  };

  const docEl = document.documentElement;
  const MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl && 'onmouseleave' in docEl;

  let isIELegacyEvent = function(event) {
    return false;
  };

  if (window.attachEvent) {
    if (window.addEventListener) {
      isIELegacyEvent = function(event) {
        return !(event instanceof window.Event);
      };
    } else {
      isIELegacyEvent = function(event) {
        return true;
      };
    }
  }

  let _isButton;

  function _isButtonForDOMEvents(event, code) {
    return event.which ? event.which === code + 1 : event.button === code;
  }

  const legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
  function _isButtonForLegacyEvents(event, code) {
    return event.button === legacyButtonMap[code];
  }

  function _isButtonForWebKit(event, code) {
    switch (code) {
      case 0:
        return event.which == 1 && !event.metaKey;
      case 1:
        return event.which == 2 || (event.which == 1 && event.metaKey);
      case 2:
        return event.which == 3;
      default:
        return false;
    }
  }

  if (window.attachEvent) {
    if (!window.addEventListener) {
      _isButton = _isButtonForLegacyEvents;
    } else {
      _isButton = function(event, code) {
        return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) : _isButtonForDOMEvents(event, code);
      };
    }
  } else if (Prototype.Browser.WebKit) {
    _isButton = _isButtonForWebKit;
  } else {
    _isButton = _isButtonForDOMEvents;
  }

  function isLeftClick(event) {
    return _isButton(event, 0);
  }

  function isMiddleClick(event) {
    return _isButton(event, 1);
  }

  function isRightClick(event) {
    return _isButton(event, 2);
  }

  function element(event) {
    event = Event.extend(event);

    let node = event.target;

    var type = event.type;

    var currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (
        type === 'load' ||
        type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input' && currentTarget.type === 'radio')
      )
        node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    let element = Event.element(event);

    if (!expression) return element;
    while (element) {
      if (Object.isElement(element) && Prototype.Selector.match(element, expression)) {
        return Element.extend(element);
      }
      element = element.parentNode;
    }
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    const docElement = document.documentElement;

    var body = document.body || { scrollLeft: 0 };

    return event.pageX || event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0);
  }

  function pointerY(event) {
    const docElement = document.documentElement;

    var body = document.body || { scrollTop: 0 };

    return event.pageY || event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0);
  }

  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }

  Event.Methods = {
    isLeftClick,
    isMiddleClick,
    isRightClick,

    element,
    findElement,

    pointer,
    pointerX,
    pointerY,

    stop
  };

  const methods = Object.keys(Event.Methods).inject({}, (m, name) => {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (window.attachEvent) {
    function _relatedTarget(event) {
      let element;
      switch (event.type) {
        case 'mouseover':
        case 'mouseenter':
          element = event.fromElement;
          break;
        case 'mouseout':
        case 'mouseleave':
          element = event.toElement;
          break;
        default:
          return null;
      }
      return Element.extend(element);
    }

    const additionalMethods = {
      stopPropagation() {
        this.cancelBubble = true;
      },
      preventDefault() {
        this.returnValue = false;
      },
      inspect() {
        return '[object Event]';
      }
    };

    Event.extend = function(event, element) {
      if (!event) return false;

      if (!isIELegacyEvent(event)) return event;

      if (event._extendedByPrototype) return event;
      event._extendedByPrototype = Prototype.emptyFunction;

      const pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX: pointer.x,
        pageY: pointer.y
      });

      Object.extend(event, methods);
      Object.extend(event, additionalMethods);

      return event;
    };
  } else {
    Event.extend = Prototype.K;
  }

  if (window.addEventListener) {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
  }

  function _createResponder(element, eventName, handler) {
    let registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) {
      CACHE.push(element);
      registry = Element.retrieve(element, 'prototype_event_registry', $H());
    }

    let respondersForEvent = registry.get(eventName);
    if (Object.isUndefined(respondersForEvent)) {
      respondersForEvent = [];
      registry.set(eventName, respondersForEvent);
    }

    if (respondersForEvent.pluck('handler').include(handler)) return false;

    let responder;
    if (eventName.include(':')) {
      responder = function(event) {
        if (Object.isUndefined(event.eventName)) return false;

        if (event.eventName !== eventName) return false;

        Event.extend(event, element);
        handler.call(element, event);
      };
    } else if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED && (eventName === 'mouseenter' || eventName === 'mouseleave')) {
      if (eventName === 'mouseenter' || eventName === 'mouseleave') {
        responder = function(event) {
          Event.extend(event, element);

          var parent = event.relatedTarget;
          while (parent && parent !== element) {
            try {
              parent = parent.parentNode;
            } catch (e) {
              parent = element;
            }
          }

          if (parent === element) return;

          handler.call(element, event);
        };
      }
    } else {
      responder = function(event) {
        Event.extend(event, element);
        handler.call(element, event);
      };
    }

    responder.handler = handler;
    respondersForEvent.push(responder);
    return responder;
  }

  function _destroyCache() {
    for (let i = 0, length = CACHE.length; i < length; i++) {
      Event.stopObserving(CACHE[i]);
      CACHE[i] = null;
    }
  }

  var CACHE = [];

  if (Prototype.Browser.IE) window.attachEvent('onunload', _destroyCache);

  if (Prototype.Browser.WebKit) window.addEventListener('unload', Prototype.emptyFunction, false);

  let _getDOMEventName = Prototype.K;

  var translations = { mouseenter: 'mouseover', mouseleave: 'mouseout' };

  if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
    _getDOMEventName = function(eventName) {
      return translations[eventName] || eventName;
    };
  }

  function observe(element, eventName, handler) {
    element = $(element);

    const responder = _createResponder(element, eventName, handler);

    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.addEventListener) element.addEventListener('dataavailable', responder, false);
      else {
        element.attachEvent('ondataavailable', responder);
        element.attachEvent('onlosecapture', responder);
      }
    } else {
      const actualEventName = _getDOMEventName(eventName);

      if (element.addEventListener) element.addEventListener(actualEventName, responder, false);
      else element.attachEvent(`on${actualEventName}`, responder);
    }

    return element;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);

    const registry = Element.retrieve(element, 'prototype_event_registry');
    if (!registry) return element;

    if (!eventName) {
      registry.each(pair => {
        let eventName = pair.key;
        stopObserving(element, eventName);
      });
      return element;
    }

    const responders = registry.get(eventName);
    if (!responders) return element;

    if (!handler) {
      responders.each(r => {
        stopObserving(element, eventName, r.handler);
      });
      return element;
    }

    let i = responders.length;

    var responder;
    while (i--) {
      if (responders[i].handler === handler) {
        responder = responders[i];
        break;
      }
    }
    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.removeEventListener) element.removeEventListener('dataavailable', responder, false);
      else {
        element.detachEvent('ondataavailable', responder);
        element.detachEvent('onlosecapture', responder);
      }
    } else {
      const actualEventName = _getDOMEventName(eventName);
      if (element.removeEventListener) element.removeEventListener(actualEventName, responder, false);
      else element.detachEvent(`on${actualEventName}`, responder);
    }

    registry.set(eventName, responders.without(responder));

    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = $(element);

    if (Object.isUndefined(bubble)) bubble = true;

    if (element == document && document.createEvent && !element.dispatchEvent) element = document.documentElement;

    let event;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('dataavailable', bubble, true);
    } else {
      event = document.createEventObject();
      event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
    }

    event.eventName = eventName;
    event.memo = memo || {};

    if (document.createEvent) element.dispatchEvent(event);
    else element.fireEvent(event.eventType, event);

    return Event.extend(event);
  }

  Event.Handler = Class.create({
    initialize(element, eventName, selector, callback) {
      this.element = $(element);
      this.eventName = eventName;
      this.selector = selector;
      this.callback = callback;
      this.handler = this.handleEvent.bind(this);
    },

    start() {
      Event.observe(this.element, this.eventName, this.handler);
      return this;
    },

    stop() {
      Event.stopObserving(this.element, this.eventName, this.handler);
      return this;
    },

    handleEvent(event) {
      let element = Event.findElement(event, this.selector);
      if (element) this.callback.call(this.element, event, element);
    }
  });

  function on(element, eventName, selector, callback) {
    element = $(element);
    if (Object.isFunction(selector) && Object.isUndefined(callback)) {
      (callback = selector), (selector = null);
    }

    return new Event.Handler(element, eventName, selector, callback).start();
  }

  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire,
    observe,
    stopObserving,
    on
  });

  Element.addMethods({
    fire,

    observe,

    stopObserving,

    on
  });

  Object.extend(document, {
    fire: fire.methodize(),

    observe: observe.methodize(),

    stopObserving: stopObserving.methodize(),

    on: on.methodize(),

    loaded: false
  });

  if (window.Event) Object.extend(window.Event, Event);
  else window.Event = Event;
})();

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  let timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try {
      document.documentElement.doScroll('left');
    } catch (e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top) timer = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
})();

Element.addMethods();

/* ------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

const Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

const Insertion = {
  Before(element, content) {
    return Element.insert(element, { before: content });
  },

  Top(element, content) {
    return Element.insert(element, { top: content });
  },

  Bottom(element, content) {
    return Element.insert(element, { bottom: content });
  },

  After(element, content) {
    return Element.insert(element, { after: content });
  }
};

const $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare() {
    this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  },

  within(element, x, y) {
    if (this.includeScrollOffsets) return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (
      y >= this.offset[1] &&
      y < this.offset[1] + element.offsetHeight &&
      x >= this.offset[0] &&
      x < this.offset[0] + element.offsetWidth
    );
  },

  withinIncludingScrolloffsets(element, x, y) {
    let offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (
      this.ycomp >= this.offset[1] &&
      this.ycomp < this.offset[1] + element.offsetHeight &&
      this.xcomp >= this.offset[0] &&
      this.xcomp < this.offset[0] + element.offsetWidth
    );
  },

  overlap(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical') return (this.offset[1] + element.offsetHeight - this.ycomp) / element.offsetHeight;
    if (mode == 'horizontal') return (this.offset[0] + element.offsetWidth - this.xcomp) / element.offsetWidth;
  },

  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone(source, target, options) {
    options = options || {};
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName)
  document.getElementsByClassName = (function(instanceMethods) {
    function iter(name) {
      return name.blank() ? null : `[contains(concat(' ', @class, ' '), ' ${name} ')]`;
    }

    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath
      ? function(element, className) {
          className = className.toString().strip();
          const cond = /\s/.test(className)
            ? $w(className)
                .map(iter)
                .join('')
            : iter(className);
          return cond ? document._getElementsByXPath(`.//*${cond}`, element) : [];
        }
      : function(element, className) {
          className = className.toString().strip();
          const elements = [];

          var classNames = /\s/.test(className) ? $w(className) : null;
          if (!classNames && !className) return elements;

          const nodes = $(element).getElementsByTagName('*');
          className = ` ${className} `;

          for (var i = 0, child, cn; (child = nodes[i]); i++) {
            if (
              child.className &&
              (cn = ` ${child.className} `) &&
              (cn.include(className) ||
                (classNames &&
                  classNames.all(name => !name.toString().blank() && cn.include(' ' + name + ' '))))
            )
              elements.push(Element.extend(child));
          }
          return elements;
        };

    return function(className, parentElement) {
      return $(parentElement || document.body).getElementsByClassName(className);
    };
  })(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize(element) {
    this.element = $(element);
  },

  _each(iterator) {
    this.element.className
      .split(/\s+/)
      .select((name) => {
        return name.length > 0;
      })
      ._each(iterator);
  },

  set(className) {
    this.element.className = className;
  },

  add(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set(
      $A(this)
        .concat(classNameToAdd)
        .join(' ')
    );
  },

  remove(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set(
      $A(this)
        .without(classNameToRemove)
        .join(' ')
    );
  },

  toString() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

(function() {
  window.Selector = Class.create({
    initialize(expression) {
      this.expression = expression.strip();
    },

    findElements(rootElement) {
      return Prototype.Selector.select(this.expression, rootElement);
    },

    match(element) {
      return Prototype.Selector.match(element, this.expression);
    },

    toString() {
      return this.expression;
    },

    inspect() {
      return `#<Selector: ${  this.expression  }>`;
    }
  });

  Object.extend(Selector, {
    matchElements(elements, expression) {
      let match = Prototype.Selector.match;

        
var results = [];

      for (let i = 0, length = elements.length; i < length; i++) {
        let element = elements[i];
        if (match(element, expression)) {
          results.push(Element.extend(element));
        }
      }
      return results;
    },

    findElement(elements, expression, index) {
      index = index || 0;
      let matchIndex = 0;

        
var element;
      for (let i = 0, length = elements.length; i < length; i++) {
        element = elements[i];
        if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
          return Element.extend(element);
        }
      }
    },

    findChildElements(element, expressions) {
      let selector = expressions.toArray().join(', ');
      return Prototype.Selector.select(selector, element || document);
    }
  });
})();
