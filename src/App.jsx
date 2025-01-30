import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

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

  //Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
       ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      };

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      };

      setMovieList(data.results || []);
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
      updateSearchCount();
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className="overflow-x-hidden">
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <a href="/">
            <img src="./logo.png" alt="logo movie app" className="w-20 mb-12" />
          </a>

          <img src="./hero.png" alt="hero banner" />
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
                  <img src={movie.poster_url} alt={movie.title} className="object-contain" />
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
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

        <section className="pagination">
          <img src="./left-arrow.png" />

          <h4>
            <span className="text-white font-bold">2</span> / 50
          </h4>

          <img src="./right-arrow.png" />
        </section>
      </div>

      <footer className="wrapper">
          <div className="text-gray-200/50 flex justify-between items-center">
            <span>&copy; 2025 Movie App</span>
            <span>Website by <a href="https://www.linkedin.com/in/sguzmanr/" className="hover:underline hover:text-white">SGuzmanR</a></span>
          </div>
      </footer>
    </main>
  )
};

export default App;
