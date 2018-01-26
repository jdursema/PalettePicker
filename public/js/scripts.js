let projects;

const generateColor = () => {
  let hex = '#'
  const values = 'ABCDEF0123456789';
    while(hex.length< 7){
      let randomIndex = Math.floor(Math.random() * 16)
      hex = hex.concat(values[randomIndex])
    } 
    return hex; 
}

const generatePalette = () => {
  const boxArray = $('.color')
  boxArray.each(function() {
    if(!$(this).next().next().hasClass('locked')){
      let color = generateColor()
      $( this ).css('background-color', color)
      $(this).next().text(color)
    }
  })

}

const openMenu = () => {
  if($('.projects').hasClass('projects-hiden')) {
    $('.projects').removeClass('projects-hiden')
    $('.projects').addClass('projects-shown')
  } else {
    $('.projects').removeClass('projects-shown')
    $('.projects').addClass('projects-hiden') 
  }
}

const changeLock = (event) => {
  ($(event.target)).toggleClass('locked')
}

const fetchProjects = async() => {
  const initialFetch = await fetch('/api/v1/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const projectResponse = await initialFetch.json()
  fetchPalettes(projectResponse.projects)
}

const fetchPalettes = async(projectsArray) => {

  const initialFetch = await fetch (`/api/v1/palettes`)
  const paletteResponse = await initialFetch.json()
  mapPalettesToProject(projectsArray, paletteResponse.palettes)
}

const mapPalettesToProject = (projects, palettes) => {
  const projectsArray = projects.map((project) => {
    const filteredPalettes = palettes.filter(palette => palette.project_id === project.id)
    return { ...project, palettes: filteredPalettes }
  })
  
  appendProjects(projectsArray) 
}

const appendProjects = (projectsArray) => {
  projects = projectsArray
  projectsArray.forEach((project, index) => {
    $('.project-holder').append(`<h5>${project.name}</h5>
     <div class='project ${project.name}'></div>`)
    project.palettes.forEach(palette => {
      $(`.${project.name}`).append(`
      <div class='palette'>
        <div class='delete-btn'></div>
        <h4>${palette.name}</h4>
        <div class='palette-card'>
          <div class='palette-color ${palette.name}color1'></div>
          <div class='palette-color ${palette.name}color2'></div>
          <div class='palette-color ${palette.name}color3'></div>
          <div class='palette-color ${palette.name}color4'></div>
          <div class='palette-color ${palette.name}color5'></div>
        </div>
      </div>`)
      $(`.${palette.name}color1`).css('background-color', palette.color_1)
      $(`.${palette.name}color2`).css('background-color', palette.color_2)
      $(`.${palette.name}color3`).css('background-color', palette.color_3)
      $(`.${palette.name}color4`).css('background-color', palette.color_4)
      $(`.${palette.name}color5`).css('background-color', palette.color_5)
    })
  })
}

const postProject = async (event) => {
  event.preventDefault()
  const projectName = $('.project-name-input').val()
  const responseProjects = await fetch (`/api/v1/projects`)
  const fetchedProjects= await responseProjects.json()
  const projectsArray = fetchedProjects.projects
  const existingProject = projectsArray.find(project => projectName === project.name)
  const paletteObj = {
    name: $('.palette-name-input').val(), 
    color_1: $('#colorGen1').text(), 
    color_2: $('#colorGen2').text(), 
    color_3: $('#colorGen3').text(), 
    color_4: $('#colorGen4').text(), 
    color_5: $('#colorGen5').text() }

  if (!existingProject){
    const newProjectPost = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: projectName})
    })
    const response = await newProjectPost.json()
    console.log(response)
    const newPalettePost = await fetch(`/api/v1/projects/${response.id}/palettes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paletteObj)
    })

  } else {
    const newPalettePost = await fetch(`/api/v1/projects/${existingProject.id}/palettes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paletteObj)
    })

  }

  $('.project-holder').children().remove()
  fetchProjects()
}

const deletePalette = async (event) => {
  if(event.target.className === 'delete-btn'){
    const paletteName = $(event.target).next().text()

    const projectName = $(event.target).parent().parent().prev().text()

    const foundProject = projects.find(project => project.name === projectName)

    const palettesArray = foundProject.palettes

    const foundPalette = palettesArray.find(palette => palette.name === paletteName)

    fetch(`/api/v1/palettes/${foundPalette.id}`, {
      method: 'DELETE'})

    $(event.target).parent().remove()
  }
}


$(document).ready(() =>{
  generatePalette()
  fetchProjects()
})

$('.menu-icon').on('click', openMenu)
$('.generate-btn').on('click', generatePalette);
$('.padlock').on('click', changeLock)
$('.save-btn').on('click', postProject)
$('.project-holder').on('click', deletePalette)