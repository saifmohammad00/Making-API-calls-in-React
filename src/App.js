import React, { useEffect, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError]=useState(null);
  const [retrying,setRetrying]=useState(false);
  const [retryInterval,setRetryInterval]=useState(null);

  useEffect(() => {
    if (retrying) {
      const timerId = setInterval(() => {
        fetchMoviesHandler();
      }, 5000);

      setRetryInterval(timerId);
    } else {
      clearInterval(retryInterval);
      setRetryInterval(null);
    }

    return () => clearInterval(retryInterval);
  }, [retrying]);
  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/film/');
      if(!response.ok){
        throw new Error("something went wrong ....Retrying");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((item) => {
        return {
          id: item.episode_id,
          title: item.title,
          openingText: item.opening_crawl,
          releaseDate: item.release_date,
        };
      });
      setMovies(transformedMovies);
      setRetrying(false);
    }
    catch (error) {
      setError(error.message);
      setRetrying(true);
    }
    setIsLoading(false);
  }
  function handleCancelRetry() {
    setRetrying(false);
    clearInterval(retryInterval);
  }
  let content=<p>Found No Movies.</p>;
  if(movies.length>0){
     content=<MoviesList movies={movies} />
  }
  if(error){
    content = (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={handleCancelRetry}>Cancel Retry</button>
      </React.Fragment>
    );
  }
  if(isLoading){
    content=<p>Loading...</p>
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
          {content}
      </section>
    </React.Fragment>
  );
}

export default App;
