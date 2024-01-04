const watchlistContainer = document.getElementById("watchlist-container");
let watchlistArr = []
const moviesFromLocalStorage = JSON.parse( localStorage.getItem("myWatchlist") )



if(moviesFromLocalStorage){
    watchlistArr = moviesFromLocalStorage
}
renderMovies()

function renderMovies() {
    return watchlistArr.length > 0 ? renderWatchlist() : renderEmpty()
}

document.addEventListener("click", (e)=> {
    if(e.target.dataset.watchlist){
        removeFromWatchlist(e.target.dataset.watchlist)
        
    }
    renderMovies()
})

function removeFromWatchlist(indexValue){
    watchlistArr.splice(indexValue, 1)
    localStorage.setItem("myWatchlist", JSON.stringify(watchlistArr));
}

function renderWatchlist() {
  let watchlistMovies = watchlistArr.map((movie, index) => {
    return `<div id=${index} class="movie-details">
                        <img src=${movie.Poster} class="movie-poster">
                        <div class="movie-info">
                            <h3>${movie.Title}<span><img src="resources/star.png"/>${movie.imdbRating}</span></h3>
                            <div>
                                <p>${movie.Runtime}</p>
                                <p>${movie.Genre}</p>
                                <p data-watchlist =${index} class="watchlist-button"><img src="resources/remove.png"/>Remove from Watchlist</p>
                            </div>
                            <p class="plot">${movie.Plot}</p>
                        </div>
                    </div>`;
  });
  watchlistContainer.innerHTML = watchlistMovies.join("")
  watchlistContainer.classList.replace("watchlist-container-empty", "movies-container")
}

function renderEmpty() {
    watchlistContainer.innerHTML = `<p>Your watchlist is looking little empty...</p>       
                                        <a href="index.html"><img src="resources/watchlist.png"/>Let's add some movies!</a>`
}

