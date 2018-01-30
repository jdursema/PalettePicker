
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
            color_2: '#FFFFFF',
            color_3: '#FFFFFF',
            color_4: '#FFFFFF',
            color_5: '#FFFFFF'},
            {name: 'Palette2', 
            project_id: project[0], 
            color_1: '#FFFFFF',
            color_2: '#FFFFFF',
            color_3: '#FFFFFF',
            color_4: '#FFFFFF',
            color_5: '#FFFFFF'}
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end Promise.all
    });
};
