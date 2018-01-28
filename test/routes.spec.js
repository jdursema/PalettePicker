process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

describe('Client routes', function() {
  it('should return the home page', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200)
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    })
  })
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/notgonnawork')
    .then(() => { 
    })
    .catch(error => {
      error.should.have.status(404);
    });
  });
});

describe('API Routes', () => {

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.projects.should.be.a('array')
        response.body.projects.length.should.equal(1)
        response.body.projects[0].should.have.property('name')
        response.body.projects[0].should.have.property('id')
        response.body.projects[0].should.have.property('created_at')
        response.body.projects[0].should.have.property('updated_at')
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('GET /api/v1/palettes', () => {
    
  })
})

