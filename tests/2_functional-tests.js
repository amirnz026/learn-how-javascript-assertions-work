const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      // Don't forget the callback...
      chai
        .request(server) // 'server' is the Express App
        .get('/hello') // http_method(url). NO NAME in the query !
        .end(function (err, res) {
          // res is the response object

          // Test the status and the text response (see the example above).
          // Please follow the order -status, -text. We rely on that in our tests.
          // It should respond 'Hello Guest'
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done(); // Always call the 'done()' callback when finished.
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .get('/hello?name=John')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, `hello John`);
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({
          name: 'Cristoforo',
          surname: 'Colombo',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Cristoforo');
          assert.equal(res.body.surname, 'Colombo');

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({
          name: 'Giovanni',
          surname: 'da Verrazzano',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
        });

      done();
    });
  });
});

const Browser = require('zombie');
Browser.site = 'https://js-testing-unit.herokuapp.com';
suite('Functional Tests with Zombie.js', function () {
  const browser = new Browser();

  this.timeout(5000);

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      suiteSetup(function (done) {
        return browser.visit('/', done);
      });
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('submit "surname" : "Colombo" - write your e2e test...', function (done) {
      // fill the form...
      // then submit it pressing 'submit' button.
      //
      // in the callback...
      // assert that status is OK 200
      // assert that the text inside the element 'span#name' is 'Cristoforo'
      // assert that the text inside the element 'span#surname' is 'Colombo'
      // assert that the element(s) 'span#dates' exist and their count is 1
      browser.fill('surname', 'Colombo').pressButton('submit', function () {
        /** YOUR TESTS HERE, Don't forget to remove assert.fail() **/

        // pressButton is Async.  Waits for the ajax call to complete...

        // assert that status is OK 200
        browser.assert.success();
        // assert that the text inside the element 'span#name' is 'Cristoforo'
        browser.assert.text('span#name', 'Cristoforo');
        // assert that the text inside the element 'span#surname' is 'Colombo'
        browser.assert.text('span#surname', 'Colombo');
        // assert that the element(s) 'span#dates' exist and their count is 1
        browser.assert.element('span#dates', 1);

        done(); // It's an async test, so we have to call 'done()''
      });
    });
    // #6
    test('submit "surname" : "Vespucci" - write your e2e test...', function (done) {
      // fill the form, and submit.
      browser.fill('surname', 'Vespucci').pressButton('submit', function () {
        // assert that status is OK 200
        browser.assert.success();
        // assert that the text inside the element 'span#name' is 'Amerigo'
        browser.assert.text('span#name', 'Amerigo');
        // assert that the text inside the element 'span#surname' is 'Vespucci'
        browser.assert.text('span#surname', 'Vespucci');
        // assert that the element(s) 'span#dates' exist and their count is 1
        browser.assert.element('span#dates', 1);

        done();
      });
    });
  });
});
