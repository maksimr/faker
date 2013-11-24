/*global faker*/

/**
 * @desc Generate random email address. If you pass only one
 * parameter it will be treat how suffix.
 *
 * @param {String} preffix The prefix of email.
 * @param {String} suffix The suffix.
 * @return {String} The email address
 */
(function() {
    'use strict';

    var NAMES = ['jessie', 'tomas', 'bennie', 'tomas', 'annette', 'sylvia', 'karla', 'alexandra', 'arthur', 'cedric', 'harvey', 'francisco', 'erika', 'moses', 'bill', 'darryl', 'lola', 'sheri', 'cecelia', 'roy', 'kimberly', 'spencer', 'kelli', 'shelly', 'kenny', 'lonnie', 'carolyn', 'rufus', 'marcia', 'jermaine', 'darnell', 'luke', 'brady', 'pete', 'allison', 'gladys', 'rosemary', 'erika', 'mack', 'andrea', 'jeannie', 'enrique', 'raul', 'lynda', 'jerome', 'yolanda', 'joseph', 'domingo', 'valerie', 'duane', 'muriel', 'greg', 'james', 'rudy', 'devin', 'wade', 'dora', 'charles', 'clayton', 'steven', 'guadalupe', 'bertha', 'bethany', 'darrel', 'minnie', 'maxine', 'molly', 'claude', 'annie', 'morris', 'susie', 'mathew', 'gerardo', 'gilbert', 'barry', 'annie', 'cindy', 'vera', 'derrick', 'thomas', 'derek', 'roxanne', 'lawrence', 'sandra', 'jeanne', 'silvia', 'julie', 'pearl', 'carolyn', 'lee', 'gustavo', 'glen', 'johnnie', 'brett', 'bethany', 'sadie', 'cora', 'miranda', 'mamie', 'lester'];
    var DOMAIN_NAMES = ['cogizio', 'cogiveo', 'feednation', 'podsphere', 'browseopia', 'voomm', 'kigen', 'cogimbee', 'trutz', 'geta', 'fanoodle', 'yambu', 'photopad', 'yonte', 'gabify', 'flashster', 'gigaspot', 'brainbridge', 'leendo', 'realfeed', 'quazu', 'meeyo', 'topiccast', 'myz', 'linkpedia', 'twittervine', 'youfly', 'flipbird', 'bluepath', 'dynatz', 'snapzone', 'babblecast', 'talia', 'bluefish', 'snapspot', 'voomba', 'myster', 'kayvee', 'quiyo', 'cogiloo', 'abaloo', 'photofly', 'dazzletype', 'mylia', 'blogbird', 'cogideo', 'ealoo', 'plalium', 'camivee', 'agizu', 'mycero', 'innopath', 'agire', 'truzzy', 'tagwire', 'flashfire', 'fivetube', 'oyore', 'feedchat', 'linkcast', 'feedjam', 'muba', 'mita', 'realopia', 'kitri', 'flipmix', 'skipdrive', 'skinder', 'imbo', 'fivevine', 'bluemix', 'yakijo', 'teksphere', 'tagspace', 'truba', 'eare', 'browsepulse'];
    var numeric = faker.directive('numeric');

    var email = function(prefix, suffix) {
        /*jshint maxcomplexity:7*/

        if (!suffix) {
            suffix = prefix;
            prefix = '';
        }

        prefix += NAMES[numeric(NAMES.length - 1)];
        suffix = suffix || DOMAIN_NAMES[numeric(DOMAIN_NAMES.length - 1)] + '.com';

        suffix = (/^\./.test(suffix)) ? DOMAIN_NAMES[numeric(DOMAIN_NAMES.length - 1)] + suffix : suffix;
        suffix = !/@/.test(suffix) ? '@' + suffix : suffix;

        return prefix + suffix;
    };

    email.NAMES = NAMES;
    email.DOMAIN_NAMES = DOMAIN_NAMES;

    faker.directive('email', email);
}());
