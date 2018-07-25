'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../server.js'); // Our app
var access_token = null;

describe('API endpoint /login', function() {
  this.timeout(5000); // How long to wait for a response (ms)

  // GET - List all colors
  it('Should generate access token', function() {
    return chai.request(app)
      .post('/api/login')
      .set('content-type', 'application/json')
      .send({
        'username': 'vivek',
        'password': 'randomPass'
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.token).to.be.a('string');
        access_token = res.body.token;
      });
  });


  it('Should give the patched json', function() {
    return chai.request(app)
      .post('/api/json-patch')
      .set('content-type', 'application/json')
      .set('x-access-token', access_token)
      .send({
        "obj":{
          "name":"vivek",
          "location":"noida"
        },
        "patch":{
          "op": "replace", "path": "/name", "value": "Vivek Singh" 
        }
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.new_json).to.be.an('object');
        expect(res.body.new_json.name).to.be.eql("Vivek Singh");
      });
  });

  // GET - Invalid path
  it('should return Not Found', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .then(function(res) {
        throw new Error('Path exists!');
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });

});