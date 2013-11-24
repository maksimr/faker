/*global faker*/

describe('phone', function() {
    var phone = faker.directive('phone');

    it('should generate random phone', function() {
        expect(phone()).to.match(/[\d]{3}-[\d]{3}-[\d]{4}$/);
    });
});
