/*global faker*/

describe('repeat', function() {
    var parse = faker.parse;

    it('should expand context directive', function() {
        parse.directive('lala', function() {
            return 'lala';
        });

        expect(parse(['{{repeat(3)}}', 'lala'])).to.eql(['lala', 'lala', 'lala']);
        expect(parse(['{{repeat(2)}}', {
            lala: ['{{repeat(2)}}', '{{lala}}']
        }])).to.eql([{
            lala: ['lala', 'lala']
        }, {
            lala: ['lala', 'lala']
        }]);
    });

    it('repeat should create copy of object', function() {
        expect(parse(['{{repeat(2)}}', {
            id: '{{index}}'
        }])).to.eql([{
            id: '1'
        }, {
            id: '2'
        }]);
    });

    it('index', function() {
        expect(parse(['{{repeat(3)}}', '{{index}}'])).to.eql(['1', '2', '3']);
    });

});
