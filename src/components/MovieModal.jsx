import { useState } from "react";

const formatVoteCount = (voteCount) => {
  if (voteCount >= 1_000_000) {
    return (voteCount / 1_000_000).toFixed(1) + 'M';
  } else if (voteCount >= 1_000) {
    return (voteCount / 1_000).toFixed(1) + 'k';
  } else {
    return voteCount; 
  };
};

const mapRating = (voteAverage) => {
  if (voteAverage >= 9) {
    return 'PG-13';
  } else if (voteAverage >= 7) {
    return 'PG';
  } else if (voteAverage >= 5) {
    return 'R';
  } else {
    return 'NC-17';
  };
};

const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' billion';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' million';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + ' thousand';
  }
  return num.toString();
};

const MovieModal = ({ movie, closeModal }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const handleTrailerClick = () => setShowTrailer(!showTrailer);

  return (
    <>
      {movie && (
        <div className="movie-modal">
          <div className="modal-container">
            <div className="modal-section text-gray-100">
              <div className="flex flex-col">
                <h2>{movie.title}</h2>

                <div className="mt-2 flex flex-row items-center flex-wrap gap-2">
                  <p>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                  <span>•</span>
                  <p>{mapRating(movie.vote_average)}</p>
                  <span>•</span>
                  <p>{`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}</p>
                </div>
              </div>

              <div className="flex flex-row gap-2 max-sm:w-full max-sm:justify-between">
                <div className="bg-[#221F3D] px-5 py-2 rounded-md flex flex-row gap-2 items-center justify-center">
                  <img src="star.svg" alt="Star icon" className="w-5" />
                  <p>
                    <span className="text-white font-bold">
                      {movie.vote_average ? `${movie.vote_average.toFixed(1)}` : 'N/A'}
                    </span>
                    /10
                  </p>
                  <p>
                    {`(${formatVoteCount(movie.vote_count)})`}
                  </p>
                </div>

                <div className="bg-[#221F3D] rounded-md flex flex-row gap-2 items-center justify-center cursor-pointer w-10 h-10" onClick={closeModal}>
                  <img src="close.png" alt="close icon" className="w-4 h-4 object-contain transition-all duration-200 hover:-translate-y-0.5 hover:scale-[101%]" />
                </div>
              </div>
            </div>

            <div className="modal-section gap-10">
              <div className="w-[27.5%] max-sm:w-full h-auto">
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} className="rounded-lg h-auto w-full" />
              </div>

              <div className="relative w-[73.5%] h-full">
                <div className={`absolute bottom-4 left-4 bg-white/30 rounded-full backdrop-blur-md flex flex-row px-4 py-2 gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 max-sm:hidden ${showTrailer ? 'hidden' : ''}`} onClick={handleTrailerClick}>
                    <img src="play.png" alt="play icon" />
                    <p className="text-white font-bold">Trailer</p>
                </div>

                <div className={`absolute top-4 left-4 bg-[#221F3D] rounded-xl backdrop-blur-md flex flex-row px-3 py-2 gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 ${showTrailer ? '' : 'hidden'}`} onClick={handleTrailerClick}>
                  <img src="close.png" alt="close icon" className="w-4 h-6 object-contain" />
                </div>

                <div className="w-full h-full flex max-sm:hidden">
                  {showTrailer ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={movie.trailerUrl}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg h-full w-full"
                    />
                  ) : (
                    <img
                      src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : '/no-movie.png'}
                      className="rounded-lg h-full w-full"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="modal-section max-sm:flex-col-reverse">
              <div className="flex w-[80%] max-sm:w-full h-auto gap-5 text-gray-100 items-center justify-start flex-col">
                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Generes</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="bg-[#221F3D] px-5 py-2 rounded-md">
                          {genre.name ? genre.name : 'Not Available'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Overview</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <span>{movie.overview ? movie.overview : "Not Available"}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Release Date</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <p>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Countries</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      {movie.production_countries.map((country, i) => (
                        <p key={i} className="flex flex-row items-center justify-center gap-3">
                          {country.name}
                          {i !== movie.production_countries.length - 1 && <span> •</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Status</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <p>{movie.status}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Languages</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      {movie.spoken_languages.map((language, i) => (
                        <p key={i}>
                          {language.name}
                          {i !== movie.spoken_languages.length - 1 && <span> •</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Budget</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <p>{movie.budget ? formatNumber(movie.budget) : 'Not Available'}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Revenue</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <p>{movie.revenue ? formatNumber(movie.revenue) : 'Not Available'}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Tagline</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      <p>{movie.tagline ? movie.tagline : 'Not Available'}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-section-details">
                  <div className="w-[20%]">
                    <h3>Production <br /> Companies</h3>
                  </div>

                  <div className="w-[80%]">
                    <div className="modal-details-data">
                      {movie.production_companies.map((companie, i) => (
                        <p key={i}>
                          {companie.name}
                          {i !== movie.production_companies.length - 1 && <span>•</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[20%] max-sm:w-full max-sm:justify-start h-full flex items-start justify-end">
                <div className="flex flex-row max-xs:flex-col gap-4">
                  <a href={movie.homepage} target="_blank" className="modal-link-webpage">
                    Visit Homepage
                  </a>

                  <a href={movie.trailerUrl} target="_blank" className="modal-link-trailer">
                    <img src="play.png" alt="play icon" />
                    Watch Trailer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MovieModal