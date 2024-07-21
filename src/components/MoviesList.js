import React from 'react';

import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = (props) => {
  const handledelete=(id)=>{
    props.deleteHandler(id);
  }
  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <Movie
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
          onClick={handledelete}
        />
      ))}
    </ul>
  );
};

export default MovieList;
