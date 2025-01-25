import React, { Component } from 'react';
import _ from 'lodash';

import Movie from '../movie/movie';
import MovieList from '../movie-list/movie-list';
import MoviesdbService from '../../services/moviedbService/moviesdbService';
import './app.css';

export default class App extends Component {
  constructor() {
    super();
    this.getMoviesInfo();
  }

  state = {
    movies: [
      {
        title: null,
        date: null,
        genres: null,
        description: null,
        posterLink: null,
        id: null
      }
    ],
    smth: null
  };

  MoviesdbService = new MoviesdbService();

  getMoviesInfo() {
    this.MoviesdbService.getMovies('return')
      .then((res) => {
        const movies = [];
        // console.log(res.results[1].id);
        for (let i = 0; i < 6; i += 1) {
          movies.push({
            title: res.results[i].title,
            releaseDate: res.results[i].release_date,
            genres: res.results[i].genre_ids,
            overview: res.results[i].overview,
            posterLink: res.results[i].poster_path,
            id: res.results[i].id
          });
        }
        // console.log(movies);
        return movies;
      })
      .then((movies) => {
        this.setState((state) => {
          const burger = 2;
          return { movies };
        }, console.log(this.state));
      });
    // this.setState((state) => console.log(state));
  }

  render() {
    // let tagId = 0;
    const { movies } = this.state;
    const tags = [];
    const elements = [];

    console.log(this.state);

    for (let i = 0; i < 6; i += 1) {
      if (movies.length <= 3) {
        return <div>Данных недостаточно</div>;
      }

      elements.push(
        <Movie
          key={movies[i].id}
          posterLink={movies[i].posterLink}
          title={movies[i].title}
          releaseDate={movies[i].releaseDate}
          overview={movies[i].overview}
        />
      );
    }

    return (
      <div className="app">
        <header className="header"></header>
        <main className="main">
          <MovieList elements={elements} tagList={tags} />
        </main>
        <footer className="footer"></footer>
      </div>
    );
  }
}
