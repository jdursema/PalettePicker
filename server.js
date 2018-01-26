
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

app.use(express.static(path.join(__dirname, '/public')));

const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    return response.status(200).json({
      projects
    })
  })
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
  .then(palettes => {
    return response.status(200).json({
      palettes
    })
  })
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for(let requiredParameter of ['name']){
    if(!project[requiredParameter]){
      return response.status(422).json({
        error: `You are miss the required parameter ${requiredParameter}`
      })
    }
  }
  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({ id: project[0] })
    })
    .catch( error => {
      return response.status(500).json({
        error
      })
    })
});

app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  const { projectId } = request.params;
  const palette = Object.assign({}, request.body, {project_id: projectId});

  for(let requiredParameter of [ 'name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']){
    if(!palette[requiredParameter]){
      return response.status(422).json({
        error: `Your missing the required parameter ${requiredParameter}`
      })
    }
  }
  database('palettes').insert(palette, 'id')
    .then(palette => {
      return response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

// get to get all palettes of a project
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.projectId).select()
    .then(palette => {
      if(palette.length){
        return response.status(200).json({
          palette
        })
      } else {
        return response.status(404).json({
          error: `Could not find palettes for project with id ${request.params.projectId}`
        })
      }
    })
    .catch(error => {
      return response.status(500).json({
        error
      })
    })
})

// delete palette
app.delete('/api/v1/palettes/:paletteId', (request, response) => {
  database('palettes').where('id', request.params.paletteId).delete()
  .then(palette => {
    return response.sendStatus(202)
  })
  .catch(error => {
    return response.status(500).json({
      error
    });
  })
})


app.listen(app.get('port'), () => {
  console.log('is listening')
})