/*global sinon, faker*/

describe('faker', function() {
    'use strict';

    // --------------------
    // raise
    describe('raise', function() {
        var raise = faker.core.raise;

        it('should raise custom exception', function() {
            expect(function() {
                raise('MyError', 'My message body');
            }).to.throwException('MyError: My message body');
        });
    });

    // --------------------
    // fromJSON
    describe('fromJSON', function() {
        var fromJSON = faker.core.fromJSON;

        it('should delegate to JSON.parse', function() {
            sinon.spy(JSON, 'parse');

            expect(fromJSON('{}')).to.eql({});
            expect(JSON.parse.called).to.be.ok();
        });

        it('should raise error on non valid string', function() {
            expect(function() {
                fromJSON('{]');
            }).to.throwException();
        });
    });

    // --------------------
    // parseParams
    describe('parseParams', function() {
        var parseParams = faker.core.parseParams;

        it('should return parameters list', function() {
            expect(parseParams('1,2')).to.eql([1, 2]);
            expect(parseParams()).to.eql([null]);
        });
    });

    // --------------------
    // getDirectives
    describe('getDirectives', function() {
        var getDirectives = faker.core.getDirectives;

        it('should extract directives from template', function() {
            var directiveTmpl = '{{fn(1,2)}} | {{empty}}';

            expect(getDirectives(directiveTmpl)[0]).to.eql({
                '0': '{{fn(1,2)}}',
                '1': 'fn',
                '2': '1,2',
                index: 0,
                input: '{{fn(1,2)}}'
            });

            expect(getDirectives(directiveTmpl)[1]).to.eql({
                '0': '{{empty}}',
                '1': 'empty',
                '2': undefined,
                index: 0,
                input: '{{empty}}'
            });
        });
    });

    // --------------------
    // DirectiveFilter
    describe('DirectiveFilter', function() {
        var DirectiveFilter = faker.core.DirectiveFilter;
        var directiveFilter;

        beforeEach(function() {
            directiveFilter = new DirectiveFilter({
                cache: {
                    directiveName: true
                },
                get: function(directiveName) {
                    return this.cache[directiveName];
                }
            });
        });

        it('should filter directive', function() {
            var myDirective = ['directiveMatch', 'directiveName'];
            expect(directiveFilter(myDirective)).to.eql(true);
            expect(directiveFilter(['directiveMatch', 'directiveOtherName'])).to.eql(false);
        });
    });

    // --------------------
    // Directive
    describe('Directive', function() {
        var Directive = faker.core.Directive;
        var directive;

        beforeEach(function() {
            directive = new Directive({
                cache: {
                    directiveName: true
                },
                get: function(directiveName) {
                    return this.cache[directiveName];
                }
            });
        });

        it('should expand directive name and paramters', function() {
            var myDirective = ['directiveMatch', 'directiveName', '1'];
            expect(directive(myDirective)).to.eql(['directiveMatch', true, [1]]);
        });
    });

    // --------------------
    // DirectiveApply
    describe('DirectiveApply', function() {
        var DirectiveApply = faker.core.DirectiveApply;
        var directiveApply;

        beforeEach(function() {
            directiveApply = new DirectiveApply('directiveMatch');
        });

        it('should apply directive to the template', function() {
            var myDirective = ['directiveMatch', 'directiveContent'];
            expect(directiveApply(myDirective)).to.eql('directiveContent');
        });
    });

    // --------------------
    // MutableString
    describe('MutableString', function() {
        var MutableString = faker.core.MutableString;
        var mString;

        beforeEach(function() {
            mString = new MutableString('a:b');
        });

        it('should change existing string not create new', function() {
            mString.replace('a', 'A');
            mString.replace('b', 'B');
            expect(mString.valueOf()).to.eql('A:B');
        });
    });

    // --------------------
    // DirectiveCollection
    describe('DirectiveCollection', function() {
        var DirectiveCollection = faker.core.DirectiveCollection;
        var directiveCollection;

        beforeEach(function() {
            directiveCollection = new DirectiveCollection();
        });

        it('should add directive to directive collection', function() {
            directiveCollection.add('MyDirective', function() {
                return 'lala';
            });

            expect(directiveCollection.get('MyDirective')).to.be.ok();
        });
    });

    // --------------------
    // Parser
    describe('Parser', function() {
        var parse = faker.parse;

        it('should return not modified data', function() {
            expect(parse([])).to.eql([]);
            expect(parse({})).to.eql({});
            expect(parse(['lala'])).to.eql(['lala']);
        });

        it('should parse string how JSON', function() {
            expect(parse('"lala"')).to.eql('lala');
        });

        it('should expand directive inside data', function() {
            parse.directive('lala', function() {
                return 'lala';
            });

            expect(parse(['{{lala}}'])).to.eql(['lala']);
            expect(parse({
                lala: '{{lala}}'
            })).to.eql({
                lala: 'lala'
            });

            expect(parse(['{{lala}} {{lala}}'])).to.eql(['lala lala']);
        });

        // Directive repeat
        it('should expand context directive', function() {
            expect(parse(['{{repeat(3)}}', 'lala'])).to.eql(['lala', 'lala', 'lala']);
            expect(parse(['{{repeat(2)}}', {
                lala: ['{{repeat(2)}}', '{{lala}}']
            }])).to.eql([{
                lala: ['lala', 'lala']
            }, {
                lala: ['lala', 'lala']
            }]);
        });

        it('idx', function() {
            parse.directive('index', function() {
                var idx = this.idx;
                return String(idx + 1);
            });
            expect(parse(['{{repeat(3)}}', '{{index}}'])).to.eql(['1', '2', '3']);
        });

        it('should set zero value', function() {
            parse.directive('null', 0);
            expect(parse(['{{null}}'])).to.eql([0]);
        });
    });
});
