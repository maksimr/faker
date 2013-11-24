/*global faker*/

describe('names', function() {
    var firstName = faker.directive('firstName');
    var lastName = faker.directive('lastName');
    var fullName = faker.directive('fullName');

    describe('firstName', function() {
        it('should generate random first name', function() {
            expect(firstName()).to.match(/[A-Z]+[A-z-]+/);
        });

        it('should generate random first name by gender', function() {
            expect(firstName('male')).to.match(/[A-Z]+[A-z-]+/);
            expect(firstName('female')).to.match(/[A-Z]+[A-z-]+/);
        });
    });

    describe('lastName', function() {
        it('should generate random last name', function() {
            expect(lastName()).to.match(/[A-Z]+[A-z-]+/);
        });
    });

    describe('fullName', function() {
        it('should generate random full name', function() {
            var fullNameRegExp = /([A-Z]+[A-z-]+)\s([A-Z]+[A-z-]+)/;
            expect(fullName()).to.match(fullNameRegExp);
            expect(fullName('male')).to.match(fullNameRegExp);
            expect(fullName('female')).to.match(fullNameRegExp);
        });
    });
});
