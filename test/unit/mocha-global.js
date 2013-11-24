(function(global) {
    /**
     * Create sandbox for sinon functions
     * It allow restore faked function after
     * each test
     */
    beforeEach(function() {
        global.sinon = global.sinon.sandbox.create();
    });

    afterEach(function() {
        global.sinon.restore();
    });
}(this));
