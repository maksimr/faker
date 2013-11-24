/*global faker*/

/**
 * @desc Random phone number.
 * @param {String} format The phone's mask. For example `8 ### ###-##-##`.
 * By default `###-###-####`
 */
(function() {
    'use strict';

    var numeric = faker.directive('numeric');

    var phone = function(format) {
        format = '###-###-####' || format;
        return format.replace(/#/g, function() {
            return numeric(9);
        });
    };

    faker.directive('phone', phone);
}());
