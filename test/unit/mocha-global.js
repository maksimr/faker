/**
 * Create sandbox for sinon functions
 * It allow restore faked function after
 * each test
 */
/*global sinon*/
beforeEach(function() {
    this.sinon = sinon.sandbox.create();
});

afterEach(function() {
    this.sinon.restore();
});
