/*global faker*/

/**
 * @desc Generate random company name.
 * @return {String} The company name
 */

(function(directiveMap) {
    'use strict';

    var COMPANIES = ['Google', 'Yanex', 'Apple', 'Dell', 'Lenovo', 'IBM', 'Microsoft', 'Twitter', 'Facebook', 'Yahoo', 'PayPal', 'Ebay'];
    var numeric = directiveMap.numeric;

    var company = function() {
        return COMPANIES[numeric(0, COMPANIES.length)];
    };

    directiveMap.company = company;
    return company;
}(typeof faker !== 'undefined' ? faker.directive : {}));
