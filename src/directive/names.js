/*global faker*/

(function() {
    'use strict';

    var MALE_FIRST_NAMES = ['Daniel', 'Dominic', 'Israel', 'Jerry', 'Thomas', 'Michael', 'Angelica', 'Joey', 'Cesar', 'Jimmie', 'Wm', 'Ian', 'Clay', 'Clinton', 'Jacob', 'Lucas', 'Cecil', 'Brian', 'Rogers', 'Luther', 'Duane', 'Moses', 'Orville', 'Angelo', 'Willie', 'Lynne', 'Alexis', 'Vernon', 'Lonnie', 'Roman', 'Morris', 'Nathan', 'Juana', 'Walter', 'Ted', 'Tyler', 'Damon', 'Douglas', 'Willard', 'Christian', 'Benny', 'Randolph', 'Wade', 'Emanuel', 'Hubert', 'Tyrone', 'Gerald', 'Elbert', 'Emmett', 'Ricardo', 'Darnell', 'Edgar', 'Matthews', 'Terry', 'Warren', 'Mitchell', 'Lionel', 'Kurt', 'Franklin', 'Ryan', 'Ellis', 'Garry', 'Kent', 'Raul', 'Patrick', 'Floyd', 'Malcolm', 'Leland', 'Chad', 'Rick', 'Douglas', 'Justin', 'Elijah', 'Alejandro', 'Irving', 'Domingo', 'Larry', 'Joseph', 'Steven', 'Darrel', 'Evans', 'Ruben', 'Omar', 'Keith', 'Harvey', 'Genevieve', 'Steven', 'Rodolfo', 'Santiago', 'Ivan', 'Bradford', 'Alton', 'Rufus', 'Travis', 'Bertha', 'Kyle', 'Fredrick', 'Arthur', 'Theodore', 'Owen'];
    var FEMALE_FIRST_NAMES = ['Tiffany', 'Nora', 'Edna', 'Maureen', 'Angela', 'Bobbie', 'Joyce', 'Tami', 'Lila', 'Betsy', 'Jessica', 'Elaine', 'Arlene', 'Renee', 'Janice', 'Tracey', 'Isabel', 'Ernestine', 'Tamara', 'Michele', 'Lora', 'Juana', 'Kay', 'Connie', 'Traci', 'Kristi', 'Robyn', 'Carla', 'Harriet', 'Luz', 'Silvia', 'Cassandra', 'Angelica', 'Leigh', 'Maryann', 'Lynne', 'Paula', 'Edith', 'Alexis', 'Kathleen', 'Whitney', 'Emma', 'Elsa', 'Rosemary', 'Paulette', 'Annette', 'Carrie', 'Maryann', 'Sheri', 'Jessie', 'Dawn', 'Bertha', 'Kimberly', 'Genevieve', 'Candace', 'Jamie', 'Debra', 'Betty', 'Rhonda', 'Diana', 'Tanya', 'Erma', 'Tonya', 'Terry', 'Lorraine', 'Ashley', 'Shawna', 'Donna', 'Sally', 'Courtney', 'Candice', 'Miriam', 'Hilda', 'Rochelle', 'Wanda', 'Dianna', 'Ada', 'Melinda', 'Mattie', 'Roxanne', 'Kara', 'Brittany', 'Audrey', 'Janice', 'Michelle', 'Olivia', 'Gwen', 'Crystal', 'Hannah', 'Melissa', 'Roberta', 'Sherry', 'Thelma', 'Jody', 'Vivian', 'Beatrice', 'Miranda', 'Katie', 'Hazel', 'Maxine'];
    var LAST_NAMES = ['Jennings', 'Bradley', 'Carpenter', 'Matthews', 'Webster', 'Park', 'Casey', 'Tyler', 'Howell', 'Sutton', 'Bates', 'Rogers', 'Clark', 'Hopkins', 'Ball', 'Lindsey', 'Alvarado', 'Wilkins', 'Brady', 'Wells', 'Hansen', 'Todd', 'Jones', 'Parsons', 'Martin', 'Phillips', 'Nash', 'Grant', 'Fernandez', 'Thornton', 'Scott', 'Morton', 'Murphy', 'Sherman', 'Duncan', 'Walton', 'Griffith', 'Luna', 'Perry', 'Ferguson', 'Mccarthy', 'Hogan', 'Roy', 'Brock', 'Byrd', 'Rivera', 'Boone', 'Woods', 'Gomez', 'Frank', 'Graham', 'Logan', 'Gilbert', 'Weber', 'Stone', 'Barker', 'Moreno', 'Moody', 'Lyons', 'Romero', 'Sanchez', 'Huff', 'Haynes', 'Delgado', 'Turner', 'Owens', 'Hawkins', 'Holmes', 'Francis', 'Walsh', 'Munoz', 'Burns', 'Reese', 'Greer', 'May', 'Weaver', 'Harris', 'Johnston', 'Richardson', 'Castro', 'Mitchell', 'Flowers', 'Anderson', 'Miles', 'Miller', 'Cook', 'Farmer', 'Hart', 'Copeland', 'Mann', 'Hanson', 'Fuller', 'Ramsey', 'Aguilar', 'Vasquez', 'Porter', 'Garza', 'Thomas', 'Kennedy', 'Bridges'];

    var numeric = faker.directive('numeric');

    /**
     * @desc Generate random first name.
     * @param {String} gender You can pass `male` or `female`
     * @return {String} First name
     */
    var names = (function() {
        var firstName = (function() {
            // Get random name from dict
            // by gender
            var getRandomName = function(gender) {
                var list;

                switch (gender) {
                    case 'male':
                        list = MALE_FIRST_NAMES;
                        break;
                    case 'female':
                        list = FEMALE_FIRST_NAMES;
                        break;
                    default:
                        list = MALE_FIRST_NAMES;
                }

                return list[numeric(0, list.length - 1)];
            };

            return function(gender) {
                gender = gender || Math.round(Math.random()) ? 'male' : 'female';
                return getRandomName(gender);
            };
        }());

        /**
         * @desc Generate random last name.
         * @return {String} Last name
         */
        var lastName = function() {
            return LAST_NAMES[numeric(0, LAST_NAMES.length - 1)];
        };

        /**
         * @desc Generate random full name.
         * @param {String} gender You can pass `male` or `female`
         * @return {String} Full name
         */
        var fullName = function(gender) {
            return firstName(gender) + ' ' + lastName();
        };

        return {
            firstName: firstName,
            lastName: lastName,
            fullName: fullName
        };
    }());

    faker.directive('firstName', names.firstName);
    faker.directive('lastName', names.lastName);
    faker.directive('fullName', names.fullName);
}());
