import React, { useCallback, useEffect, useRef, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-movies-app-44446-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json');
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadedMovies);
    }
    catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [])
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);
  const deleteHandler = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://react-movies-app-44446-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${id}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete movie.');
      }
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };
  let content = <p>Found No Movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} deleteHandler={deleteHandler}/>
  }
  if (error) {
    content = <p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
  }
  const titleref = useRef(null);
  const openingref = useRef(null);
  const releaseref = useRef(null);

  async function formHandler(event) {
    event.preventDefault();
    if (titleref.current.value === "" || openingref.current.value === "" || releaseref.current.value === "") {
      return;
    }
    const newMovie = {
      title: titleref.current.value,
      openingText: openingref.current.value,
      releaseDate: releaseref.current.value
    }
    titleref.current.value = '';
    openingref.current.value = '';
    releaseref.current.value = '';
    const response = await fetch('https://react-movies-app-44446-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: "POST",
      body: JSON.stringify(newMovie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    console.log(data);
  };
  return (
    <React.Fragment>
      <section>
        <form>
          <div style={{ textAlign: "left" }}>
            <strong>Title</strong><br />
            <input type='text' name="title" ref={titleref} />
          </div>
          <br />
          <div style={{ textAlign: "left" }}>
            <strong>Opening Text</strong><br />
            <input type='text' name="openingText" ref={openingref} />
          </div>
          <br />
          <div style={{ textAlign: "left" }}>
            <strong>Release Date</strong><br />
            <input type='text' name="releaseDate" ref={releaseref} />
          </div>
          <button onClick={formHandler}>Add Movie</button>
        </form>
      </section>
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
