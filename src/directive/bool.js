/*global faker*/

/**
 * @desc Return random boolean value.
 *
 * @return {Boolean}
 */
(function() {
    var bool = function() {
        return Boolean(Math.round(Math.random()));
    };

    faker.directive('bool', bool);
}());
