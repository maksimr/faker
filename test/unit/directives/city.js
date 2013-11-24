/*global faker*/

describe('city', function() {
    var city = faker.directive('city');
    var state = faker.directive('state');
    var street = faker.directive('street');

    describe('state', function() {
        it('should generate random state name', function() {
            expect(state()).to.match(/[A-Z]{1}[A-z]+/);
        });
    });

    describe('city', function() {
        it('should generate random city name', function() {
            expect(city()).to.match(/[A-Z]{1}[A-z]+/);
        });
    });

    describe('street', function() {
        it('should generate random street name', function() {
            expect(street()).to.match(/[A-z\s]+/);
        });
    });
});
