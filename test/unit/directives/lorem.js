/*global faker*/

describe('lorem', function() {
    var lorem = faker.directive('lorem');

    describe('words', function() {
        it('should generate words by default', function() {
            expect(lorem(2).split(' ').length).to.eql(2);
        });

        it('should generate words', function() {
            expect(lorem('%w', 5).split(' ').length).to.eql(5);
        });

        it('should generate range words', function() {
            expect(lorem(2, 5).split(' ').length).to.be.within(2, 5);
        });
    });

    describe('characters', function() {
        it('should generate characters', function() {
            expect(lorem('%c', 2).length).to.eql(2);
            expect(lorem('%c', 5).length).to.eql(5);
        });

        it('should generate range characters', function() {
            expect(lorem('%c', 2, 5).length).to.be.within(2, 5);
        });
    });

    describe('paragraphs', function() {
        it('should generate paragraphs', function() {
            expect(lorem('%p', 2).split('\n\n').length).to.eql(2);
            expect(lorem('%p', 5).split('\n\n').length).to.eql(5);
        });

        it('should generate range paragraphs', function() {
            expect(lorem('%p', 2, 5).split('\n\n').length).to.be.within(2, 5);
        });
    });
});
