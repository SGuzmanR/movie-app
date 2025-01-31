const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <li className="movie-card" onClick={() => onMovieClick(movie.id)}>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} alt={movie.title} className="w-auto h-auto" />

      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star icon" className="w-auto h-auto" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{movie.original_language}</p>
          <span>•</span>
          <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </li>
  )
};

export default MovieCard;