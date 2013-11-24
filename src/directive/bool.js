/*global faker*/

/**
 * @desc Return random boolean value.
 *
 * @return {Boolean}
 */
(function(directiveMap) {
    var bool = function() {
        return Boolean(Math.round(Math.random()));
    };

    directiveMap.bool = bool;
    return bool;
}(typeof faker !== 'undefined' ? faker.directive : {}));
