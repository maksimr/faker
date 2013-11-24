/*global faker*/

describe('email', function() {
    var email = faker.directive('email');

    it('should generate email', function() {
        expect(email()).to.match(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/);
    });

    it('should generate email with predefine prefix and suffix', function() {
        expect(email('The', '@yandex.com')).to.match(/^The([a-zA-Z0-9_.-])+@yandex\.com/);
    });

    describe('suffix', function() {
        it('should generate email with predefine top-level domain name', function() {
            expect(email('.com')).to.match(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.com/);
        });

        it('should generate email with predefine domain(withou @)', function() {
            expect(email('yandex.com')).to.match(/^([a-zA-Z0-9_.-])+@yandex\.com/);
        });

        it('should generate email with predefine domain', function() {
            expect(email('@yandex.com')).to.match(/^([a-zA-Z0-9_.-])+@yandex\.com/);
        });
    });
});
