import React, { useCallback, useEffect, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData,setFormData]=useState({
    title:"",
    openingText:"",
    releaseDate:""
  });

  const fetchMoviesHandler=useCallback(async ()=>{
    setIsLoading(true);
    setError(null);
    console.log("hello")
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error("something went wrong");
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
    }
    catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  },[])
  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  let content = <p>Found No Movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }
  if (error) {
    content =<p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const consoleBrowser = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData({
      title: '',
      openingText: '',
      releaseDate: '',
    });
  };
  return (
    <React.Fragment>
      <section>
        <form>
          <div style={{textAlign:"left"}}>
            <strong>Title</strong><br/>
            <input type='text' name="title" value={formData.title} onChange={handleChange}/>
          </div>
          <br/>
          <div style={{textAlign:"left"}}>
            <strong>Opening Text</strong><br/>
            <input type='text' name="openingText" value={formData.openingText} onChange={handleChange}/>
          </div>
          <br/>
          <div style={{textAlign:"left"}}>
            <strong>Release Date</strong><br/>
            <input type='date' name="releaseDate" value={formData.releaseDate} onChange={handleChange}/>
          </div>
          <button onClick={consoleBrowser}>Add Movie</button>
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
