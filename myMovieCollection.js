// 1: get API info
const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies'
const POSTER_URL = BASE_URL + 'posters/'

// Default display setting
const MOVIES_PER_PAGE = 12
let currentPage = 1

// 2: Container for API info
const movies = JSON.parse(localStorage.getItem('collection'))
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-form-input')
const pagination = document.querySelector('#pagination')

renderMoviesByCard(getMoviesByPage(currentPage))
renderPaginator(movies.length)
// Listen
// Search Form
searchForm.addEventListener('submit', function onSearchFormSubmitted(e) {
  e.preventDefault()
  searchMovies(e)
})

searchForm.addEventListener('input', function onSearchFormSubmitted(e) {
  e.preventDefault()
  searchMovies(e)
})

// Data Panel -> Modal / Add to Collection
dataPanel.addEventListener('click', function onDataPanelClicked(e) {
  if (e.target.matches('.btn-show-modal')) {
    showModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-delete-from-collection')) {
    deleteFromCollection(Number(e.target.dataset.id))
    renderMoviesByCard(getMoviesByPage(currentPage))
    renderPaginator(movies.length)
  }
})

// Pagination
pagination.addEventListener('click', function onPaginationClicked(e) {
  if (e.target.tagName !== 'A') return
  currentPage = Number(e.target.dataset.page)
  renderMoviesByCard(getMoviesByPage(currentPage))
})

// function
// 3: Render data Panel 
function renderMoviesByCard(items) {
  let rawHTML = ''

  items.forEach((item) => {
    rawHTML += `
      <div class="col-3 mb-3">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="movie-poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-modal" data-toggle="modal"
              data-target="#movie-modal" data-id="${item.id}">
              More
            </button>
            <button type="button" class="btn btn-danger btn-delete-from-collection" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}

// 4: Search Form
function searchMovies(e) {
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  if (!filteredMovies.length) {
    return alert(`沒有符合關鍵字「${keyword}」的電影`)
  }

  renderPaginator(filteredMovies.length)
  renderMoviesByCard(getMoviesByPage(currentPage))
}

// 5: show modal
function showModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  const movie = movies.find(movie => movie.id === id)

  movieTitle.innerText = movie.title
  movieImage.innerHTML = `<img src="${POSTER_URL + movie.image}" alt="movie-poster">`
  movieDate.innerText = `Release Day: ${movie.release_date}`
  movieDescription.innerText = movie.description
}

// 6: Render paginator
function renderPaginator(itemLength) {
  numOfPages = Math.ceil(itemLength / MOVIES_PER_PAGE)
  let rawHTML = '<ul class="pagination justify-content-center mt-2">'

  for (let page = 1; page <= numOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  rawHTML += '</ul>'
  pagination.innerHTML = rawHTML
}

// 7: Get sliced movies array
function getMoviesByPage(page) {
  let data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 9: Delete from collection
function deleteFromCollection(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)
  if ((movies.length) % MOVIES_PER_PAGE === 0) {
    currentPage -= 1
    console.log(currentPage)
  }
  localStorage.setItem('collection', JSON.stringify(movies))
}