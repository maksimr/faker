/*global faker*/

describe('company', function() {
    var company = faker.directive('company');

    it('should generate random company name', function() {
        expect(company()).to.match(/[A-z-_0-9]+/);
    });
});
