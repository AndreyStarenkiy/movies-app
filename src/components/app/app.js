import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';

import Movie from '../movie/movie';
import MovieList from '../movie-list/movie-list';
import MoviesdbService from '../../services/moviedbService/moviesdbService';
import './app.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
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
      loading: true,
      error: false
    };
    this.getMoviesInfo();
  }

  MoviesdbService = new MoviesdbService();

  getMoviesInfo() {
    this.MoviesdbService.getMovies('return')
      .then((res) => {
        const movies = [];

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
        this.setState({
          movies,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          error: true,
          loading: false
        });
      });
    // this.setState((state) => console.log(state));
  }

  render() {
    // let tagId = 0;
    const { movies, loading, error } = this.state;
    const tags = [];
    const elements = [];

    if (loading) {
      return <Spin size="large" />;
    }

    if (error) {
      return (
        <div className="app">
          <h1>Ain`t nobody here but us chickens!</h1>
        </div>
      );
    }

    for (let i = 0; i < 6; i += 1) {
      if (movies.length <= 3) {
        return <Spin size="large" />;
      }

      elements.push(
        <Movie
          key={movies[i].id}
          posterLink={movies[i].posterLink}
          title={movies[i].title}
          releaseDate={movies[i].releaseDate}
          overview={movies[i].overview}
          loading={loading}
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
