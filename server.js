//import express. Express is a framework the we can use with Node.js that helps simplify server-side functionality.
const express = require('express');
//import bodyParser. Body Parser is middleware that parses incoming requests
const bodyParser = require('body-parser');
//instantiating a new instance of express
const app = express();
// import path 
const path = require('path');

//set up our environment. 
const environment = process.env.NODE_ENV || 'development';

//have our app use the doc in the public directory
app.use(express.static(path.join(__dirname, '/public')));

//
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration);

//set up the port
app.set('port', process.env.PORT || 3000);

//set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//set up 'GET' request for projects
app.get('/api/v1/projects', (request, response) => {
  //select projects from the database
  database('projects').select()
  //take the promise you receive from the database and if the response is successful, return a status of 200 and the project object
  .then(projects => {
    return response.status(200).json({
      projects
    })
  })
  //if the promise is unsuccessful return a status of 500 and the error object
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})

//set up a request to 'GET' all the palettes
app.get('/api/v1/palettes', (request, response) => {
  //from the database select the palettes databse
  database('palettes').select()
  // take the promise you recieved from the database and if it was successful, return a status of 200 and the palettes object
  .then(palettes => {
    return response.status(200).json({
      palettes
    })
  })
  //if the promise was unsuccessful, return a status of 500 along with the error object
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})

// set up a 'POST' request to post a new project
app.post('/api/v1/projects', (request, response) => {
  //assign the request object's body to project because the user's project name will be in the body
  const project = request.body;

  //check to see if the user included a project name

  for(let requiredParameter of ['name']){
    // if the user did not include a project name
    if(!project[requiredParameter]){
      // then return a return a status of 422 and an error that says what required parameter they are missing
      return response.status(422).json({
        error: `You are miss the required parameter ${requiredParameter}`
      })
    }
  }
  //if the user did include a name, insert the new project into the database
  database('projects').insert(project, 'id')
    // then return a successful status of 201 and the project's id. 
    .then(project => {
      return response.status(201).json({ id: project[0] })
    })
    // if there is an error adding the new project, return a status of 500 and the error obj
    .catch( error => {
      return response.status(500).json({
        error
      })
    })
});

// set up a 'POST' request to post a new palette
app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  //assign the variable projectId to request.params and destructure it
  const { projectId } = request.params;
  //create a object called palette that includes the request body and the project id assigned to the key project_id
  const palette = Object.assign({}, request.body, {project_id: projectId});
  //check to see if the user included all the required parameters to create a new palette
  for(let requiredParameter of [ 'name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']){
    //if the user did not include all the required parameters
    if(!palette[requiredParameter]){
      //return a status of 422 and an error message that says what parameter they are using
      return response.status(422).json({
        error: `Your missing the required parameter ${requiredParameter}`
      })
    }
  }
  //in the palettes' database insert the new palette
  database('palettes').insert(palette, 'id')
    //take the response from the database request and return a status of 201 and the palette id
    .then(palette => {
      return response.status(201).json({ id: palette[0] })
    })
    //if there is an error posting the new palette, return a response of 500 along with the error object
    .catch(error => {
      return response.status(500).json({ error })
    })
})

// get to get all palettes of a specific project
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  //within the palettes database find where the project_id is equal to the request parameters and select it
  database('palettes').where('project_id', request.params.projectId).select()
    // response comes back as successful
    .then(palette => {
      //if there is a palette that has a matching project_id
      if(palette.length){
        //return a response with a status of 200 along with the palette
        return response.status(200).json({
          palette
        })
        //if there isn't a palette that has a matching project_id
      } else {
        //return a response of 404 and tell the user that that palette can't be found
        return response.status(404).json({
          error: `Could not find palettes for project with id ${request.params.projectId}`
        })
      }
    })
    //if the response is unsuccessful, return a status of 500 and the error
    .catch(error => {
      return response.status(500).json({
        error
      })
    })
})

// delete palette
app.delete('/api/v1/palettes/:paletteId', (request, response) => {
  //within the palettes database, find where the palette id is equal to the request params and delete it
  database('palettes').where('id', request.params.paletteId).delete()
  //take the reponse, if it successful, return a response of 202
  .then(palette => {
    return response.sendStatus(202)
  })
  //if the reponse is unsuccessful, return a status of 500 along with the error
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})


//sanity check to make sure the port is listening in the terminal
app.listen(app.get('port'), () => {
  console.log('is listening')
})

module.exports = app