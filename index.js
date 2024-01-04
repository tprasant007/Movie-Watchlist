const myKey = "92b5121c";
const moviesContainer = document.getElementById("movies-container");
const searchButton = document.getElementById("search-button");
const userInput = document.getElementById("movies-text");
const moviesFromLocalStorage = JSON.parse( localStorage.getItem("myWatchlist") )
let watchlistArr = []


// search and display movie
document.getElementById("search-form").addEventListener("submit",function(e){
    e.preventDefault()
    renderMovies()
} )

// retreiving local storage data in array
if(moviesFromLocalStorage){
    watchlistArr = moviesFromLocalStorage
}
console.log(watchlistArr)

// eventlistener for add to watchlist
document.addEventListener("click", function(e){
    if(e.target.dataset.watchlist) {
        setWatchlist(e.target.dataset.watchlist)
        changeWatchlistStatus(e.target.dataset.watchlist)
    }
})

// check if already is in watchlist if not then push in watchlist array
function setWatchlist(imdbID){
    fetch(`http://www.omdbapi.com/?apikey=${myKey}&i=${imdbID}`)
        .then(res=>res.json())
        .then(data=> {
            const isNotInWatchlist = watchlistArr.every(item => item.imdbID !== data.imdbID);
            if (isNotInWatchlist) {
                watchlistArr.unshift(data);
                localStorage.setItem("myWatchlist", JSON.stringify(watchlistArr));
            }
        })
}

// toggle watchlist status
function changeWatchlistStatus(id){
    document.querySelector(`[data-watchlist=${id}`).innerHTML = `✅Added`
}

async function renderMovies() {
    moviesContainer.textContent = "Loading..."
    try{
        // fetch the movie api and get imdbID
        const res = await fetch(`http://www.omdbapi.com/?apikey=${myKey}&s=${userInput.value}`);
        const data = await res.json();

        //fetch and render movies with respective imdbID
        const moviesHtml = await Promise.all(data.Search.map(async (movie) => {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${myKey}&i=${movie.imdbID}`);
            const data = await res.json();
            return `<div id=${movie.imdbID} class="movie-details">
                        <img src=${movie.Poster} class="movie-poster">
                        <div class="movie-info">
                            <h3>${movie.Title}<span><img src="resources/star.png"/>${data.imdbRating}</span></h3>
                            <div>
                                <p>${data.Runtime}</p>
                                <p>${data.Genre}</p>
                                <p data-watchlist =${movie.imdbID} class="watchlist-button"><img src="resources/watchlist.png"/>Watchlist</p>
                            </div>
                            <p class="plot">${data.Plot}</p>
                        </div>
                    </div>`;
        }));

        moviesContainer.innerHTML = moviesHtml.join("");
        moviesContainer.classList.replace("movies-container-empty", "movies-container")
        }

    catch(error){
        moviesContainer.innerHTML = `<p style="
            font-size: 24px;
            color: #DFDDDD"
        >Unable to find what you’re looking for. Please try another search.</p>`
    }
}
