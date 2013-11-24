/*global faker*/

/**
 * @desc Random phone number.
 * @param {String} format The phone's mask. For example `8 ### ###-##-##`.
 * By default `###-###-####`
 */
(function(directiveMap) {
    'use strict';

    var numeric = directiveMap.numeric;

    var phone = function(format) {
        format = '###-###-####' || format;
        return format.replace(/#/g, function() {
            return numeric(9);
        });
    };

    directiveMap.phone = phone;
    return phone;
}(typeof faker !== 'undefined' ? faker.directive : {}));
