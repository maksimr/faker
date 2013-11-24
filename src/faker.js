(function() {
    'use strict';

    var _global = (function() {
        return this || eval.call(null, 'this');
    }());

    /**
     * Check undefined value or not
     */
    var isUndefined = function(value) {
        return typeof value === 'undefined';
    };

    /**
     * @desc Generates random number in range from "min" max "max". If "min" is float,
     * generated number will be float too. If you pass only one parameter
     * than it equal to numeric(0,`param`).
     * Can be negative.
     *
     * @param {Number} min The minimal value
     * @param {Number} max The maximal value
     */
    var numeric = (function(parseInt, Math) {
        var isFloat = function(num) {
            return (/\./).test(num.toString());
        };

        return function(min, max) {
            var num;

            if (!max) {
                max = min;
                min = 0;
            }

            num = min + Math.random() * (max - min);
            return isFloat(min) ? num : Math.floor(num);
        };
    }(parseInt, Math));

    /**
     * TODO(maksimrv): Improve implementation
     *
     * @desc Repeat elemnts in array
     * @param {Number} count The count of repeats
     */
    var repeat = function(count) {
        count = count || 1;

        var context = this;
        var idx = this.idx;
        var value = context[idx + 1];
        return new Array(count).join(',').split(',').map(function() {
            return value;
        });
    };

    /**
     * @desc Raise error
     *
     * @param {String} type The error type
     * @param {String} message The message body of error
     *
     * This is private function used only inside plugin
     */
    var raise = function(type, message) {
        var args = [].slice.call(arguments, 0);
        message = '%s: %s'.replace(/%s/g, function() {
            return args.shift();
        });

        var error = new Error(message);

        throw error;
    };

    /**
     * @desc Convert json to javascript entity
     * @param {String} str
     * @return {Any} Return javascript entity
     */
    var fromJSON = function(str) {
        var entity;

        if (typeof str !== 'string') {
            return str;
        }

        if (!_global.JSON) {
            raise('ReferenceError', 'JSON is not defined');
        }

        try {
            entity = JSON.parse(str);
        } catch (e) {
            raise('SyntaxError', 'Unable to parse JSON string');
        }

        return entity;
    };

    /**
     * @desc Convert string to list of
     * parameters.
     *
     * @param {String|Undefined} pStr The string with paramters
     * @return {Array} The list of parameters
     */
    var parseParams = function(pStr) {
        return (pStr || 'null').split(',').map(fromJSON);
    };

    /**
     * @desc Extract directives from template
     *
     * @param {String} template The template
     * @return {Array} The list of directives inside template
     */
    var getDirectives = function(template) {
        var directiveNameRegExp = '([\\w_]+[\\w\\d-_]*)'; // parse name of directive
        var directiveParamsRegExp = '(?:\\((.*)\\))?'; // parse params of directive
        var directiveRegExp = new RegExp('{{' + directiveNameRegExp + directiveParamsRegExp + '}}', 'mg');

        var Directive = function(directiveString) {
            directiveRegExp.lastIndex = 0;
            return directiveRegExp.exec(directiveString);
        };

        return (template.match(directiveRegExp) || []).map(Directive);
    };

    /**
     * @constructor
     *
     * @param {Array} $directives list of directives
     * @return {Function} The function filter directive
     */
    var DirectiveFilter = function($directives) {
        return function(directive) {
            var directiveValue = $directives.get(directive[1]);
            return isUndefined(directiveValue) ? false : true;
        };
    };

    /**
     * @constructor
     *
     * @param {Array} $directives list of directives
     * @return {Function} The function which return
     * directive by name
     */
    var Directive = function($directives) {
        return function(directive) {
            directive[1] = $directives.get(directive[1]);
            directive[2] = parseParams(directive[2]);
            return directive;
        };
    };

    /**
     * @desc Return function which
     * apply directive to the template.
     *
     * @param {String} data The string wich will be replaced
     * @param {Object} context The function's context
     */

    var DirectiveApply = function(data, context) {
        var getClass = Object.prototype.toString;
        var isFunction = function(that) {
            return getClass.call(that) === '[object Function]';
        };
        context = context || data;
        return function(directive) {
            var directiveValue = isFunction(directive[1]) ? directive[1].apply(context, directive[2]) : directive[1];
            if (getClass.call(directiveValue) !== '[object String]') {
                return directiveValue;
            }
            return data.replace(directive[0], directiveValue);
        };
    };

    /**
     *  @desc Creat mutable string
     *  @param {String} value The primitive string value
     *  @return {Object} The mutable string object
     */
    var MutableString = function(value) {
        var stringObj = Object(value);
        stringObj.currentValue = value;
        stringObj.valueOf = function() {
            return this.currentValue;
        };
        stringObj.replace = function() {
            this.currentValue = this.currentValue.replace.apply(this.currentValue, arguments);
            return this;
        };
        return stringObj;
    };

    /**
     * @desc Collection of directives
     *
     */
    var DirectiveCollection = function() {
        if (!(this instanceof DirectiveCollection)) {
            return new DirectiveCollection();
        }
        this.cache = {};
    };
    DirectiveCollection.prototype.add = function(directiveName, directiveValue) {
        this.cache[directiveName] = directiveValue;
    };
    DirectiveCollection.prototype.get = function(directiveName) {
        return this.cache[directiveName];
    };

    /**
     * @desc Parse passed data. Replace directives
     * on their value.
     *
     * @param {Any} data The user's data
     * @return {Any} Parsed user's data
     */
    var parse = function(data) {
        var getClass = Object.prototype.toString;

        var directives = parse.directiveCollection;
        // inject directives
        var directiveFilter = new DirectiveFilter(directives);
        var directive = new Directive(directives);

        var $directiveParse = function(data, context) {
            var directiveValue = getDirectives(data).filter(directiveFilter).map(directive).map(new DirectiveApply(new MutableString(data), context)).shift();

            if (isUndefined(directiveValue)) {
                return data;
            }

            return directiveValue.valueOf();
        };

        var $parse = function(_data, context) {
            /*jshint maxcomplexity:8*/

            context = context || _data;
            switch (getClass.call(_data)) {
                case '[object String]':
                    _data = $directiveParse(_data, context);
                    break;
                case '[object Number]':
                    _data = _data;
                    break;
                case '[object Array]':
                    context = _data.slice(0);
                    for (var i = 0, l = _data.length; i < l; i += 1) {
                        context.idx = i;
                        var v = $parse(_data[i], context);
                        // If change type from string to object
                        // then replase all context
                        if (getClass.call(_data[i]) === '[object String]' && getClass.call(v) === '[object Array]') {
                            _data = $parse(v);
                            break;
                        }
                        _data[i] = v;
                    }
                    break;
                case '[object Object]':
                    Object.keys(_data).forEach(function(key) {
                        this[key] = $parse(this[key], context);
                    }, _data);
                    break;
                default:
            }

            return _data;
        };

        data = fromJSON(data);
        return $parse(data);
    };

    parse.directiveCollection = new DirectiveCollection();
    parse.directive = function(directiveName, directiveConstructor) {
        if (arguments.length === 1) {
            return parse.directiveCollection.get(directiveName);
        }
        parse.directiveCollection.add(directiveName, directiveConstructor);
    };

    parse.directive('numeric', numeric);
    parse.directive('repeat', repeat);

    _global.faker = {
        core: {
            raise: raise,
            fromJSON: fromJSON,
            parseParams: parseParams,
            getDirectives: getDirectives,
            DirectiveFilter: DirectiveFilter,
            Directive: Directive,
            DirectiveApply: DirectiveApply,
            MutableString: MutableString,
            DirectiveCollection: DirectiveCollection
        },
        directive: parse.directive,
        parse: parse
    };
}());
