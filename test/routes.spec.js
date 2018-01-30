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
    it('should return all of the palettes', () => {
      return chai.request(server)
      .get('/api/v1/palettes')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.palettes.should.be.a('array')
        response.body.palettes[0].should.have.property('name')
        response.body.palettes[0].should.have.property('id')
        response.body.palettes[0].should.have.property('project_id')
        response.body.palettes[0].should.have.property('color_1')
        response.body.palettes[0].should.have.property('color_2')
        response.body.palettes[0].should.have.property('color_3')
        response.body.palettes[0].should.have.property('color_4')
        response.body.palettes[0].should.have.property('color_5')
        
        const foundPalette = response.body.palettes.find( palette => palette.name === 'Palette1');

        foundPalette.color_1.should.equal('#FFFFFF')
        foundPalette.color_2.should.equal('#000000')
        foundPalette.color_3.should.equal('#FF006E')
        foundPalette.color_4.should.equal('#FB5607')
        foundPalette.color_5.should.equal('#8338EC')
      })
      .catch(error => {
        throw error
      })
    })
  })
  describe('POST /api/v1/project', () => {
    it('should create a new project', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'Project2'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object')
        response.body.should.have.property('id');
      })
      .catch(error => {
        throw error;
      })
    })
    it('should not create a project if the user forgot to include a name', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        random: "skdfls"
      })
      .then(response => {
      })
      .catch(error => {
        error.should.have.status(422)
        error.response.body.error.should.equal('You are miss the required parameter name')
      })
    })
  })
  
  describe('POST /api/v1/projects/1/palettes', () => {
    it('should create a new palette', () => {
      return chai.request(server)
      .post('/api/v1/projects/1/palettes')
      .send({
        name: 'Palette3',
        color_1: '#C1DBE3',
        color_2: '#C7DFC5',
        color_3: '#F6FEAA',
        color_4: '#FCE694',
        color_5: '#373737'
      })
      .then(response => {
        response.should.have.status(201)
      })
      .catch(error => {
        throw error
      })
    })
    it('should not create a palette with missing data', () => {
      return chai.request(server)
      .post('/api/v1/projects/1/palettes')
      .send({
        color_1: '#C1DBE3',
        color_2: '#C7DFC5',
        color_3: '#F6FEAA',
        color_4: '#FCE694',
        color_5: '#373737'
      })
      .then(response => {
      })
      .catch(error => {
        error.should.have.status(422)
        error.response.body.error.should.equal('Your missing the required parameter name')
      }) 
    })
  })
  
  describe('GET /api/v1/projects/1/palettes', () => {
    it('should get the palettes from a specific project', () => {
      return chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200)
        response.body.palette.should.be.a('array')
        response.body.palette[0].should.have.property('name')
        response.body.palette[0].should.have.property('id')
        response.body.palette[0].should.have.property('project_id')
        response.body.palette[0].should.have.property('color_1')
        response.body.palette[0].should.have.property('color_2')
        response.body.palette[0].should.have.property('color_3')
        response.body.palette[0].should.have.property('color_4')
        response.body.palette[0].should.have.property('color_5')
      })
      .catch(error => {
        throw error
      })
    })
    it('should return an error status if the project does not exist', () => {
      return chai.request(server)
      .get('/api/v1/projects/104/palettes')
      .then(response => {
  
      })
      .catch(error => {
        error.should.have.status(404)
      })
    })
  })
  
  describe('DELETE /api/v1/palettes/2', () => {
    it('should delete a palette', () => {
      return chai.request(server)
      .delete('/api/v1/palettes/2')
      .then(response => {
        response.should.have.status(202)
      })
      .catch(error => {
        throw error
      })
    })
  })
})

