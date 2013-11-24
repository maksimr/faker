/*global faker*/

describe('bool', function() {
    it('should generate random boolean valaue', function() {
        expect(faker.directive('bool')()).to.match(/(true|false)/);
    });
});
