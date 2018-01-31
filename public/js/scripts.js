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
  console.log(projectResponse)
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
  projects = projectsArray
  projectsArray.forEach((project, index) => {
    const removeChars = RegExp(/\W+/)
    const projectName = project.name.replace(removeChars, '')
    $('.project-holder').append(`<h5>${projectName}</h5>
     <div class='project ${projectName}'></div>`)
     projectsArray.palettes.forEach(palette => {
      const paletteName= palette.name.replace(removeChars, '')
      $(`.${project.name}`).append(`
      <div class='palette'>
        <div class='delete-btn'></div>
        <h4>${paletteName}</h4>
        <div class='palette-card ${paletteName}'>
          <div class='palette-color color1'></div>
          <div class='palette-color color2'></div>
          <div class='palette-color color3'></div>
          <div class='palette-color color4'></div>
          <div class='palette-color color5'></div>
        </div>
      </div>`)
      
      $(`.${palette.name}`).find('.color1').css('background-color', palette.color_1)
      $(`.${palette.name}`).find('.color2').css('background-color', palette.color_2)
      $(`.${palette.name}`).find('.color3').css('background-color', palette.color_3)
      $(`.${palette.name}`).find('.color4').css('background-color', palette.color_4)
      $(`.${palette.name}`).find('.color5').css('background-color', palette.color_5)
    })
  })
}

const postProject = async (event) => {
  event.preventDefault()
  const removeChars = RegExp(/\W+/)
  const projectName = $('.project-name-input').val().replace(removeChars, '')
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
    const paletteName= paletteObj.name.replace(removeChars, '')
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