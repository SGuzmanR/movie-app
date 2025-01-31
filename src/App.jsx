import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App =() => {
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 800, [searchTerm]);

  useEffect(() => {
    if (searchTerm !== debounceSearchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm, debounceSearchTerm]);

  const fetchMovies = async (query = '', page = 1) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
       ? `${API_BASE_URL}/search/movie?include_adult=true?&query=${encodeURIComponent(query)}&page=${page}`
       : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      };

      setMovieList(data.results || []);
      setTotalPages(data.total_pages);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      };

      updateSearchCount();
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again.');
    } finally {
      setLoading(false);
    };
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    };
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const endpoint = `${API_BASE_URL}/movie/${movieId}?append_to_response=videos`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) throw new Error('Failed to fetch movie details');

      const movieDetails = await response.json();

      const trailer = movieDetails.videos?.results?.find(video => video.type === 'Trailer');

      setSelectedMovie({
        ...movieDetails,
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0` : null,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    };
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm, currentPage);
  }, [debounceSearchTerm, currentPage]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return (
    <main className="overflow-x-hidden">
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <a href="/">
            <img src="./logo.png" alt="logo movie app" className="w-20 h-auto mb-12" />
          </a>

          <img src="./hero.png" alt="hero banner" className="w-auto h-auto" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, i) => (
                <li key={movie.$id}>
                  <p>{i + 1}</p>
                  <img src={movie.poster_url} alt={`Trending Movie Number ${i + 1}`} className="object-contain" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className={trendingMovies.length === 0 ? 'mt-[40px]' : ''}>{searchTerm === '' ? 'Popular' : `Search for '${searchTerm}'`}</h2>

          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onMovieClick={fetchMovieDetails} />
              ))}
            </ul>
          )}
        </section>
        
        {totalPages !== 1 && (
          <section className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <img src="./left-arrow.png" alt="previous arrow" className="w-auto h-auto" />
            </button>

            <h4>
              <span className="text-white font-bold">{currentPage}</span> / {totalPages}
            </h4>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <img src="./right-arrow.png" alt="next arrow" className="w-auto h-auto" />
            </button>
          </section>
        )}
      </div>

      <footer className="wrapper">
          <div className="footer">
            <span>&copy; 2025 Movie App</span>
            <span>Website by <a href="https://www.linkedin.com/in/sguzmanr/" className="hover:underline hover:text-white">SGuzmanR</a></span>
          </div>
      </footer>

      {showModal && <MovieModal movie={selectedMovie} closeModal={() => setShowModal(false)} />}
    </main>
  )
};

export default App;
