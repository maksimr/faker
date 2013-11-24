/*global faker*/

/**
 * @desc Random US state name
 */
(function() {
    'use strict';

    var numeric = faker.directive('numeric');

    var state = (function() {
        var STATE = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        return function() {
            return STATE[numeric(STATE.length - 1)];
        };
    }());

    /**
     * @desc Random US city name
     */
    var city = (function() {
        var CITY = ['Albany', 'Islip', 'Rochester', 'Buffalo', 'New York City', 'Syracuse', 'Olympia', 'Tacoma', 'Spokane', 'Seattle', 'Albuquerque', 'Roswell', 'Santa Fe', 'Las Cruces', 'Anchorage', 'Haines', 'Seward', 'Barrow', 'Juneau', 'Sitka', 'Deadhorse', 'Katchikan', 'Skagway', 'Denali National Park', 'Kodiak', 'Valdez', 'Fairbanks', 'Nome'];
        return function() {
            return CITY[numeric(CITY.length - 1)];
        };
    }());

    /**
     * @desc Random street name
     */
    var street = (function() {
        var STREET = ['Drapkin Gardens', 'Gullet Wood Bypass', 'Boulderstone Nook', 'West Dryden Terrace', 'Ormsay Arch', 'East Paidge Green', 'South Benmere Parkway', 'West Ebener Alley', 'South Branch Row', 'Southwest Napa Valley Street', 'Lommel Trace', 'North Bevers Quay', 'North Algea Vale', 'Creeper Lane', 'Hawk Crest', 'Plummer Causeway', 'East Croft Walk', 'West Stowecroft Heights', 'No Name Uno Cove', 'North Tate Naylor Parkway', 'Powers Gardens', 'West Vaux Townline', 'East Van Dyke Trail', 'Mount Oso', 'Kramer Walk', 'Southwest Sheeplands Spur', 'North Baxendale Knoll', 'East Morgal Gate', 'Daplyn Lawn', 'Weald Hall Lawn', 'West Charlesfield Arch', 'East Opengate Lane', 'West Cherston Park', 'West Jodane Crescent', 'Thomas Doyle Gardens', 'Saumur Way', 'West Done Green', 'Monaton Drive', 'Fulks Farm Loop West', 'Decoy Hill Plaza', 'Sajak Garth North', 'West Wheel House', 'East Vanwall Bypass', 'West Fury Street', 'Southeast Maximfeldt Bay', 'Le Franc', 'Reedham Bypass', 'East Brionne Quadrant', 'North Marillian Street', 'Ships Curve Southeast'];
        return function() {
            return STREET[numeric(STREET.length - 1)];
        };
    }());

    faker.directive('state', state);
    faker.directive('city', city);
    faker.directive('street', street);
}());
