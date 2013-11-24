/*global faker*/

/**
 * @desc Generate random company name.
 * @return {String} The company name
 */

(function() {
    'use strict';

    var COMPANIES = ['Google', 'Yanex', 'Apple', 'Dell', 'Lenovo', 'IBM', 'Microsoft', 'Twitter', 'Facebook', 'Yahoo', 'PayPal', 'Ebay'];
    var numeric = faker.directive('numeric');

    var company = function() {
        return COMPANIES[numeric(0, COMPANIES.length)];
    };

    faker.directive('company', company);
}());
