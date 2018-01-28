
exports.seed = function(knex, Promise) {
  return knex('palettes').del() //delete all palettes
    .then(() => knex('projects').del()) //delete all projects
    .then(function() {
      return Promise.all([

        knex('projects').insert({
          name: 'Project1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {name: 'Palette1', 
            project_id: project[0], 
            color_1: '#FFFFFF',
            color_2: '#000000',
            color_3: '#FF006E',
            color_4: '#FB5607',
            color_5: '#8338EC'},
            {name: 'Palette 2', 
            project_id: project[0], 
            color_1: '#97EAD2',
            color_2: '#8CC7A1',
            color_3: '#816E94',
            color_4: '#74226C',
            color_5: '#4B2142'}
          ])
        })
        .then(() => console.log('testing Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end Promise.all
    });
};