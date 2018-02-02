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
  try {const initialFetch = await fetch('/api/v1/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const projectResponse = await initialFetch.json()
  fetchPalettes(projectResponse.projects)}
  catch(error){
    throw error
  }
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
  projects= projectsArray
  projectsArray.forEach((project) => {
    $('.project-holder').append(`
      <h5 class='project-name'>${project.name}</h5>
      <div id='${project.id}' class='project'>
      </div>`)
    project.palettes.forEach(palette => {
      $(`#${project.id}`).append(`
        <div class='palette'>
          <div class='delete-btn' id='${palette.id}'></div>
          <h4>${palette.name}</h4>
          <div class='palette-card' id='${palette.id}'>
            <div class='palette-color' id='${palette.id}-color1'></div>
            <div class='palette-color' id='${palette.id}-color2'></div>
            <div class='palette-color' id='${palette.id}-color3'></div>
            <div class='palette-color' id='${palette.id}-color4'></div>
            <div class='palette-color' id='${palette.id}-color5'></div>
          </div>
        </div>`)

      $(`#${palette.id}-color1`).css('background-color', palette.color_1)
      $(`#${palette.id}-color2`).css('background-color', palette.color_2)
      $(`#${palette.id}-color3`).css('background-color', palette.color_3)
      $(`#${palette.id}-color4`).css('background-color', palette.color_4)
      $(`#${palette.id}-color5`).css('background-color', palette.color_5)
    })
  })
}

const postProject = async (event) => {
  event.preventDefault()
  const projectName = $('.project-name-input').val()
  const existingProject = projects.find(project => projectName === project.name)
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
    const paletteName= paletteObj.name
    const newPalettePost = await fetch(`/api/v1/projects/${response.id}/palettes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...paletteObj, name: paletteName})
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
    const paletteId = $(event.target).attr('id')
    fetch(`/api/v1/palettes/${paletteId}`, {
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