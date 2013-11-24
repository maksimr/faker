/*global faker*/

describe('numeric', function() {
    var numeric = faker.directive('numeric');

    it('should generate random number', function() {
        expect(numeric(2, 3)).to.be.within(2, 3);
        expect(numeric(0, 5)).to.be.within(0, 5);
    });

    it('should generate random float number', function() {
        expect(numeric(2.1, 2.8)).to.be.within(2.1, 2.8);
        expect(numeric(0.0, 5.0)).to.be.within(0.0, 5.0);
    });

    it('should generate random negative number', function() {
        expect(numeric(-4, -2)).to.be.within(-4, -2);
        expect(numeric(-4.5, -4.1)).to.be.within(-4.5, -4.1);
    });

    it('should generate random number from 0 to passed value if we pass only one parameter', function() {
        expect(numeric(1)).to.be.within(0, 1);
        expect(numeric(5)).to.be.within(0, 5);
    });
});
