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
     * Clone object
     * Need for repeat function
     */
    var extend = function(dist, source) {
        var getClass = Object.prototype.toString;

        Object.keys(source).forEach(function(key) {
            var value = source[key];

            if (getClass.call(value) === '[Object Object]') {
                dist[key] = extend({}, value);
                return;
            }

            if (getClass.call(value) === '[Object Array]') {
                dist[key] = extend([], value);
                return;
            }

            dist[key] = value;
        });

        return dist;
    };

    /**
     * TODO(maksimrv): Improve implementation
     *
     * @desc Repeat elemnts in array
     * @param {Number} count The count of repeats
     */
    var repeat = function(count) {
        count = count || 1;

        var context = this;
        var idx = this.index;
        var value = context[idx + 1];
        return new Array(count).join(',').split(',').map(function() {
            return typeof value === 'object' ? extend({}, value) : value;
        });
    };

    /**
     * Directive index
     * @desc Return index of element in array
     */
    var index = function() {
        return String(this.index + 1);
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
     * @param {[Object]} directiveMap The local directives
     * @return {Any} Parsed user's data
     */
    var parse = function(data, directiveMap) {
        var getClass = Object.prototype.toString;

        var directives = parse.defaultDirectiveCollection;
        var localDirectivesCollection = null;

        if (directiveMap) {
            localDirectivesCollection = new DirectiveCollection();

            Object.keys(parse.defaultDirectiveCollection.cache).forEach(function(key) {
                localDirectivesCollection.add(key, parse.defaultDirectiveCollection.cache[key]);
            });

            Object.keys(directiveMap).forEach(function(key) {
                localDirectivesCollection.add(key, directiveMap[key]);
            });

            directives = localDirectivesCollection;
        }

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
                        context.index = i;
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

    parse.defaultDirectiveCollection = new DirectiveCollection();
    parse.directive = function(directiveName, directiveConstructor) {
        if (arguments.length === 1) {
            return parse.defaultDirectiveCollection.get(directiveName);
        }
        parse.defaultDirectiveCollection.add(directiveName, directiveConstructor);
    };

    parse.directive('numeric', numeric);
    parse.directive('repeat', repeat);
    parse.directive('index', index);

    var faker = _global.faker = {
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

    if (typeof exports === 'object') {
        exports.faker = faker;
    }

    return faker;
}());
;/*global faker*/

/**
 * @desc Return random boolean value.
 *
 * @return {Boolean}
 */
(function() {
    var bool = function() {
        return Boolean(Math.round(Math.random()));
    };

    faker.directive('bool', bool);
}());
;/*global faker*/

/**
 * @desc Random US state name
 */
(function() {
    'use strict';

    var numeric = faker.directive('numeric');

    var state = (function() {
        var STATE = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        return function() {
            return STATE[numeric(STATE.length - 1)];
        };
    }());

    /**
     * @desc Random US city name
     */
    var city = (function() {
        var CITY = ['Albany', 'Islip', 'Rochester', 'Buffalo', 'New York City', 'Syracuse', 'Olympia', 'Tacoma', 'Spokane', 'Seattle', 'Albuquerque', 'Roswell', 'Santa Fe', 'Las Cruces', 'Anchorage', 'Haines', 'Seward', 'Barrow', 'Juneau', 'Sitka', 'Deadhorse', 'Katchikan', 'Skagway', 'Denali National Park', 'Kodiak', 'Valdez', 'Fairbanks', 'Nome'];
        return function() {
            return CITY[numeric(CITY.length - 1)];
        };
    }());

    /**
     * @desc Random street name
     */
    var street = (function() {
        var STREET = ['Drapkin Gardens', 'Gullet Wood Bypass', 'Boulderstone Nook', 'West Dryden Terrace', 'Ormsay Arch', 'East Paidge Green', 'South Benmere Parkway', 'West Ebener Alley', 'South Branch Row', 'Southwest Napa Valley Street', 'Lommel Trace', 'North Bevers Quay', 'North Algea Vale', 'Creeper Lane', 'Hawk Crest', 'Plummer Causeway', 'East Croft Walk', 'West Stowecroft Heights', 'No Name Uno Cove', 'North Tate Naylor Parkway', 'Powers Gardens', 'West Vaux Townline', 'East Van Dyke Trail', 'Mount Oso', 'Kramer Walk', 'Southwest Sheeplands Spur', 'North Baxendale Knoll', 'East Morgal Gate', 'Daplyn Lawn', 'Weald Hall Lawn', 'West Charlesfield Arch', 'East Opengate Lane', 'West Cherston Park', 'West Jodane Crescent', 'Thomas Doyle Gardens', 'Saumur Way', 'West Done Green', 'Monaton Drive', 'Fulks Farm Loop West', 'Decoy Hill Plaza', 'Sajak Garth North', 'West Wheel House', 'East Vanwall Bypass', 'West Fury Street', 'Southeast Maximfeldt Bay', 'Le Franc', 'Reedham Bypass', 'East Brionne Quadrant', 'North Marillian Street', 'Ships Curve Southeast'];
        return function() {
            return STREET[numeric(STREET.length - 1)];
        };
    }());

    faker.directive('state', state);
    faker.directive('city', city);
    faker.directive('street', street);
}());
;/*global faker*/

/**
 * @desc Generate random company name.
 * @return {String} The company name
 */

(function() {
    'use strict';

    var COMPANIES = ['Google', 'Yanex', 'Apple', 'Dell', 'Lenovo', 'IBM', 'Microsoft', 'Twitter', 'Facebook', 'Yahoo', 'PayPal', 'Ebay'];
    var numeric = faker.directive('numeric');

    var company = function() {
        return COMPANIES[numeric(0, COMPANIES.length)];
    };

    faker.directive('company', company);
}());
;/*global faker*/

/**
 * @desc Generate random email address. If you pass only one
 * parameter it will be treat how suffix.
 *
 * @param {String} preffix The prefix of email.
 * @param {String} suffix The suffix.
 * @return {String} The email address
 */
(function() {
    'use strict';

    var NAMES = ['jessie', 'tomas', 'bennie', 'tomas', 'annette', 'sylvia', 'karla', 'alexandra', 'arthur', 'cedric', 'harvey', 'francisco', 'erika', 'moses', 'bill', 'darryl', 'lola', 'sheri', 'cecelia', 'roy', 'kimberly', 'spencer', 'kelli', 'shelly', 'kenny', 'lonnie', 'carolyn', 'rufus', 'marcia', 'jermaine', 'darnell', 'luke', 'brady', 'pete', 'allison', 'gladys', 'rosemary', 'erika', 'mack', 'andrea', 'jeannie', 'enrique', 'raul', 'lynda', 'jerome', 'yolanda', 'joseph', 'domingo', 'valerie', 'duane', 'muriel', 'greg', 'james', 'rudy', 'devin', 'wade', 'dora', 'charles', 'clayton', 'steven', 'guadalupe', 'bertha', 'bethany', 'darrel', 'minnie', 'maxine', 'molly', 'claude', 'annie', 'morris', 'susie', 'mathew', 'gerardo', 'gilbert', 'barry', 'annie', 'cindy', 'vera', 'derrick', 'thomas', 'derek', 'roxanne', 'lawrence', 'sandra', 'jeanne', 'silvia', 'julie', 'pearl', 'carolyn', 'lee', 'gustavo', 'glen', 'johnnie', 'brett', 'bethany', 'sadie', 'cora', 'miranda', 'mamie', 'lester'];
    var DOMAIN_NAMES = ['cogizio', 'cogiveo', 'feednation', 'podsphere', 'browseopia', 'voomm', 'kigen', 'cogimbee', 'trutz', 'geta', 'fanoodle', 'yambu', 'photopad', 'yonte', 'gabify', 'flashster', 'gigaspot', 'brainbridge', 'leendo', 'realfeed', 'quazu', 'meeyo', 'topiccast', 'myz', 'linkpedia', 'twittervine', 'youfly', 'flipbird', 'bluepath', 'dynatz', 'snapzone', 'babblecast', 'talia', 'bluefish', 'snapspot', 'voomba', 'myster', 'kayvee', 'quiyo', 'cogiloo', 'abaloo', 'photofly', 'dazzletype', 'mylia', 'blogbird', 'cogideo', 'ealoo', 'plalium', 'camivee', 'agizu', 'mycero', 'innopath', 'agire', 'truzzy', 'tagwire', 'flashfire', 'fivetube', 'oyore', 'feedchat', 'linkcast', 'feedjam', 'muba', 'mita', 'realopia', 'kitri', 'flipmix', 'skipdrive', 'skinder', 'imbo', 'fivevine', 'bluemix', 'yakijo', 'teksphere', 'tagspace', 'truba', 'eare', 'browsepulse'];
    var numeric = faker.directive('numeric');

    var email = function(prefix, suffix) {
        /*jshint maxcomplexity:7*/

        if (!suffix) {
            suffix = prefix;
            prefix = '';
        }

        prefix += NAMES[numeric(NAMES.length - 1)];
        suffix = suffix || DOMAIN_NAMES[numeric(DOMAIN_NAMES.length - 1)] + '.com';

        suffix = (/^\./.test(suffix)) ? DOMAIN_NAMES[numeric(DOMAIN_NAMES.length - 1)] + suffix : suffix;
        suffix = !/@/.test(suffix) ? '@' + suffix : suffix;

        return prefix + suffix;
    };

    email.NAMES = NAMES;
    email.DOMAIN_NAMES = DOMAIN_NAMES;

    faker.directive('email', email);
}());
;/*global faker*/

/**
 * Lorem Ipsum is simply dummy text of the printing and typesetting industry.
 */
(function() {
    'use strict';

    var numeric = faker.directive('numeric');

    var LOREM_TEXT = [
        'Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla non arcu lacinia neque faucibus fringilla. Nulla non lectus sed nisl molestie malesuada. Proin in tellus sit amet nibh dignissim sagittis. Vivamus luctus egestas leo. Maecenas sollicitudin. Nullam rhoncus aliquam metus. Etiam egestas wisi a erat.',
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Aliquam erat volutpat. Nunc auctor. Mauris pretium quam et urna. Fusce nibh. Duis risus. Curabitur sagittis hendrerit ante. Aliquam erat volutpat. Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Duis condimentum augue id magna semper rutrum. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae, justo. Fusce consectetuer risus a nunc. Aliquam ornare wisi eu metus. Integer pellentesque quam vel velit. Duis pulvinar.',
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi gravida libero nec velit. Morbi scelerisque luctus velit. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Proin mattis lacinia justo. Vestibulum facilisis auctor urna. Aliquam in lorem sit amet leo accumsan lacinia. Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede sem sit amet enim. Phasellus et lorem id felis nonummy placerat. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Aenean vel massa quis mauris vehicula lacinia. Quisque tincidunt scelerisque libero. Maecenas libero. Etiam dictum tincidunt diam. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Suspendisse nisl. Sed convallis magna eu sem. Cras pede libero, dapibus nec, pretium sit amet, tempor quis, urna.',
        'Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium lectus id turpis. Etiam sapien elit, consequat eget, tristique non, venenatis quis, ante. Fusce wisi. Phasellus faucibus molestie nisl. Fusce eget urna. Curabitur vitae diam non enim vestibulum interdum. Nulla quis diam. Ut tempus purus at lorem.',
        'In sem justo, commodo ut, suscipit at, pharetra vitae, orci. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam id dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris dictum facilisis augue. Fusce tellus. Pellentesque arcu. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Sed elit dui, pellentesque a, faucibus vel, interdum nec, diam. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu, urna. Nullam at arcu a est sollicitudin euismod. Praesent dapibus. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Nam sed tellus id magna elementum tincidunt.',
        'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam commodo dui eget wisi. Donec iaculis gravida nulla. Donec quis nibh at felis congue commodo. Etiam bibendum elit eget erat.',
        'Praesent in mauris eu tortor porttitor accumsan. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Aenean fermentum risus id tortor. Integer imperdiet lectus quis justo. Integer tempor. Vivamus ac urna vel leo pretium faucibus. Mauris elementum mauris vitae tortor. In dapibus augue non sapien. Aliquam ante. Curabitur bibendum justo non orci.',
        'Morbi leo mi, nonummy eget, tristique non, rhoncus non, leo. Nullam faucibus mi quis velit. Integer in sapien. Fusce tellus odio, dapibus id, fermentum quis, suscipit id, erat. Fusce aliquam vestibulum ipsum. Aliquam erat volutpat. Pellentesque sapien. Cras elementum. Nulla pulvinar eleifend sem. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque porta. Vivamus porttitor turpis ac leo.',
        'Maecenas ipsum velit, consectetuer eu, lobortis ut, dictum at, dui. In rutrum. Sed ac dolor sit amet purus malesuada congue. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Suspendisse sagittis ultrices augue. Mauris metus. Nunc dapibus tortor vel mi dapibus sollicitudin. Etiam posuere lacus quis dolor. Praesent id justo in neque elementum ultrices. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. In convallis. Fusce suscipit libero eget elit. Praesent vitae arcu tempor neque lacinia pretium. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus.',
        'Aenean placerat. In vulputate urna eu arcu. Aliquam erat volutpat. Suspendisse potenti. Morbi mattis felis at nunc. Duis viverra diam non justo. In nisl. Nullam sit amet magna in magna gravida vehicula. Mauris tincidunt sem sed arcu. Nunc posuere. Nullam lectus justo, vulputate eget, mollis sed, tempor sed, magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam neque. Curabitur ligula sapien, pulvinar a, vestibulum quis, facilisis vel, sapien. Nullam eget nisl. Donec vitae arcu.'
    ];

    LOREM_TEXT.MAX_NUM = LOREM_TEXT.length - 1;

    var getWords = function(amount) {
        var loremText;
        var TEXT = LOREM_TEXT;
        var index = numeric(0, TEXT.MAX_NUM);
        var words = [];

        while (words.length < amount) {
            loremText = TEXT[index].split(' ');

            if (!words.length) {
                words.push(loremText[0]);
            } else {
                words.push(loremText[numeric(1, loremText.length - 1)]);
            }

            index = index + 1 >= TEXT.MAX_NUM ? 0 : index + 1;
        }

        return words.join(' ');
    };

    var getCharacters = function(amount) {
        var loremText = LOREM_TEXT.join('\n\n');
        while (loremText.length < amount) {
            loremText += loremText;
        }
        loremText = loremText.substring(0, amount);
        return loremText;
    };

    var getParagraphs = function(amount) {
        var paragraphs = [];
        var index = numeric(0, LOREM_TEXT.MAX_NUM);
        while (paragraphs.length < amount) {
            paragraphs.push(LOREM_TEXT[index]);
            index = index + 1 >= LOREM_TEXT.MAX_NUM ? 0 : index + 1;
        }
        return paragraphs.join('\n\n');
    };


    var lorem = function(type, amount, max) {
        /*jshint maxcomplexity:7*/

        var data = '';

        if (typeof type !== 'string') {
            max = amount;
            amount = type;
            type = '%w';
        }

        amount = max ? numeric(amount, max) : amount;

        switch (type) {
            case '%w':
                data = getWords(amount);
                break;
            case '%c':
                data = getCharacters(amount);
                break;
            case '%p':
                data = getParagraphs(amount);
                break;
            default:
                data = getWords(amount);
        }
        return data;
    };

    faker.directive('lorem', lorem);
}());
;/*global faker*/

(function() {
    'use strict';

    var MALE_FIRST_NAMES = ['Daniel', 'Dominic', 'Israel', 'Jerry', 'Thomas', 'Michael', 'Angelica', 'Joey', 'Cesar', 'Jimmie', 'Wm', 'Ian', 'Clay', 'Clinton', 'Jacob', 'Lucas', 'Cecil', 'Brian', 'Rogers', 'Luther', 'Duane', 'Moses', 'Orville', 'Angelo', 'Willie', 'Lynne', 'Alexis', 'Vernon', 'Lonnie', 'Roman', 'Morris', 'Nathan', 'Juana', 'Walter', 'Ted', 'Tyler', 'Damon', 'Douglas', 'Willard', 'Christian', 'Benny', 'Randolph', 'Wade', 'Emanuel', 'Hubert', 'Tyrone', 'Gerald', 'Elbert', 'Emmett', 'Ricardo', 'Darnell', 'Edgar', 'Matthews', 'Terry', 'Warren', 'Mitchell', 'Lionel', 'Kurt', 'Franklin', 'Ryan', 'Ellis', 'Garry', 'Kent', 'Raul', 'Patrick', 'Floyd', 'Malcolm', 'Leland', 'Chad', 'Rick', 'Douglas', 'Justin', 'Elijah', 'Alejandro', 'Irving', 'Domingo', 'Larry', 'Joseph', 'Steven', 'Darrel', 'Evans', 'Ruben', 'Omar', 'Keith', 'Harvey', 'Genevieve', 'Steven', 'Rodolfo', 'Santiago', 'Ivan', 'Bradford', 'Alton', 'Rufus', 'Travis', 'Bertha', 'Kyle', 'Fredrick', 'Arthur', 'Theodore', 'Owen'];
    var FEMALE_FIRST_NAMES = ['Tiffany', 'Nora', 'Edna', 'Maureen', 'Angela', 'Bobbie', 'Joyce', 'Tami', 'Lila', 'Betsy', 'Jessica', 'Elaine', 'Arlene', 'Renee', 'Janice', 'Tracey', 'Isabel', 'Ernestine', 'Tamara', 'Michele', 'Lora', 'Juana', 'Kay', 'Connie', 'Traci', 'Kristi', 'Robyn', 'Carla', 'Harriet', 'Luz', 'Silvia', 'Cassandra', 'Angelica', 'Leigh', 'Maryann', 'Lynne', 'Paula', 'Edith', 'Alexis', 'Kathleen', 'Whitney', 'Emma', 'Elsa', 'Rosemary', 'Paulette', 'Annette', 'Carrie', 'Maryann', 'Sheri', 'Jessie', 'Dawn', 'Bertha', 'Kimberly', 'Genevieve', 'Candace', 'Jamie', 'Debra', 'Betty', 'Rhonda', 'Diana', 'Tanya', 'Erma', 'Tonya', 'Terry', 'Lorraine', 'Ashley', 'Shawna', 'Donna', 'Sally', 'Courtney', 'Candice', 'Miriam', 'Hilda', 'Rochelle', 'Wanda', 'Dianna', 'Ada', 'Melinda', 'Mattie', 'Roxanne', 'Kara', 'Brittany', 'Audrey', 'Janice', 'Michelle', 'Olivia', 'Gwen', 'Crystal', 'Hannah', 'Melissa', 'Roberta', 'Sherry', 'Thelma', 'Jody', 'Vivian', 'Beatrice', 'Miranda', 'Katie', 'Hazel', 'Maxine'];
    var LAST_NAMES = ['Jennings', 'Bradley', 'Carpenter', 'Matthews', 'Webster', 'Park', 'Casey', 'Tyler', 'Howell', 'Sutton', 'Bates', 'Rogers', 'Clark', 'Hopkins', 'Ball', 'Lindsey', 'Alvarado', 'Wilkins', 'Brady', 'Wells', 'Hansen', 'Todd', 'Jones', 'Parsons', 'Martin', 'Phillips', 'Nash', 'Grant', 'Fernandez', 'Thornton', 'Scott', 'Morton', 'Murphy', 'Sherman', 'Duncan', 'Walton', 'Griffith', 'Luna', 'Perry', 'Ferguson', 'Mccarthy', 'Hogan', 'Roy', 'Brock', 'Byrd', 'Rivera', 'Boone', 'Woods', 'Gomez', 'Frank', 'Graham', 'Logan', 'Gilbert', 'Weber', 'Stone', 'Barker', 'Moreno', 'Moody', 'Lyons', 'Romero', 'Sanchez', 'Huff', 'Haynes', 'Delgado', 'Turner', 'Owens', 'Hawkins', 'Holmes', 'Francis', 'Walsh', 'Munoz', 'Burns', 'Reese', 'Greer', 'May', 'Weaver', 'Harris', 'Johnston', 'Richardson', 'Castro', 'Mitchell', 'Flowers', 'Anderson', 'Miles', 'Miller', 'Cook', 'Farmer', 'Hart', 'Copeland', 'Mann', 'Hanson', 'Fuller', 'Ramsey', 'Aguilar', 'Vasquez', 'Porter', 'Garza', 'Thomas', 'Kennedy', 'Bridges'];

    var numeric = faker.directive('numeric');

    /**
     * @desc Generate random first name.
     * @param {String} gender You can pass `male` or `female`
     * @return {String} First name
     */
    var names = (function() {
        var firstName = (function() {
            // Get random name from dict
            // by gender
            var getRandomName = function(gender) {
                var list;

                switch (gender) {
                    case 'male':
                        list = MALE_FIRST_NAMES;
                        break;
                    case 'female':
                        list = FEMALE_FIRST_NAMES;
                        break;
                    default:
                        list = MALE_FIRST_NAMES;
                }

                return list[numeric(0, list.length - 1)];
            };

            return function(gender) {
                gender = gender || Math.round(Math.random()) ? 'male' : 'female';
                return getRandomName(gender);
            };
        }());

        /**
         * @desc Generate random last name.
         * @return {String} Last name
         */
        var lastName = function() {
            return LAST_NAMES[numeric(0, LAST_NAMES.length - 1)];
        };

        /**
         * @desc Generate random full name.
         * @param {String} gender You can pass `male` or `female`
         * @return {String} Full name
         */
        var fullName = function(gender) {
            return firstName(gender) + ' ' + lastName();
        };

        return {
            firstName: firstName,
            lastName: lastName,
            fullName: fullName
        };
    }());

    faker.directive('firstName', names.firstName);
    faker.directive('lastName', names.lastName);
    faker.directive('fullName', names.fullName);
}());
;/*global faker*/

/**
 * @desc Random phone number.
 * @param {String} format The phone's mask. For example `8 ### ###-##-##`.
 * By default `###-###-####`
 */
(function() {
    'use strict';

    var numeric = faker.directive('numeric');

    var phone = function(format) {
        format = '###-###-####' || format;
        return format.replace(/#/g, function() {
            return numeric(9);
        });
    };

    faker.directive('phone', phone);
}());
