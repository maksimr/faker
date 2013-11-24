# faker

[![Build Status](https://travis-ci.org/maksimr/faker.png?branch=master)](https://travis-ci.org/maksimr/faker) [![Build Status](https://drone.io/github.com/maksimr/faker/status.png)](https://drone.io/github.com/maksimr/faker/latest)

> Library for creating dinamic mock stucture

## Example of usage

```javascript
foo = faker.parse({
  "text": ["repeat(3)", "foo"]
});

expect(foo).to.be.eql({
    "text": ["foo", "foo", "foo"]
});
```


## Installation

The easiest way is to keep `faker` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "faker": "~0.0.1"
  }
}
```

You can simple do it by:
```bash
npm install faker --save-dev
```

For using it in browser, simple load file from

```bash
/node_modules/faker/dist/faker.min.js
```


## Predefined directives

 * numeric
 * repeat
 * bool
 * lorem
 * city
 * state
 * street
 * company
 * email
 * firstName
 * lastName
 * fullName
 * phone

## Creating custom directive

Simple directive. Add global directive
```javascript
faker.directive('foo', 'bar');
expect(faker.parse(['{{foo}}'])).to.be.eql(['bar']);
```

More complex directive with usage of function
```javascript
faker.directive('greet', function (person) {
    return 'Hello ' + person;
});

expect(faker.parse(['{{greet("Maksim")}}'])).to.be.eql(['Hello Maksim']);
```

Run parser with local directive which shadow global directives
```javascript
expect(faker.parse('"{{lorem}}"', {
    lorem: 'my-lorem'
})).to.be.eql('my-lorem');
```
