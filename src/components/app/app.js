import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';

import Movie from '../movie/movie';
import MovieList from '../movie-list/movie-list';
import MoviesdbService from '../../services/moviedbService/moviesdbService';
import './app.css';

export default class App extends Component {
  state = {
    movies: undefined,
    loading: false,
    error: false,
    searchValue: '',
    firstVisit: true
  };

  MoviesdbService = new MoviesdbService();

  getMoviesInfo = (searchValue) => {
    this.setState({ loading: true });

    if (this.state.searchValue !== '') {
      this.MoviesdbService.getMovies(searchValue)
        .then((res) => {
          if (res.total_results === 0) {
            this.setState({
              movies: undefined,
              loading: false,
              firstVisit: false
            });
          } else {
            let movies = [];

            movies = res.results.map((movie) => {
              return {
                title: movie.title,
                releaseDate: movie.release_date,
                genres: movie.genre_ids,
                overview: movie.overview,
                posterLink: movie.poster_path,
                id: movie.id
              };
            });

            this.setState({
              movies,
              loading: false,
              firstVisit: false
            });
          }
        })
        .catch(() => {
          this.setState({
            error: true,
            loading: false
          });
        });
    } else {
      this.setState({
        error: false,
        loading: false,
        firstVisit: false
      });
    }
  };

  handleInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      this.getMoviesInfo(this.state.searchValue);
    }
  };

  render() {
    const { movies, loading, error, searchValue, firstVisit } = this.state;
    const tags = [];
    let elements;

    if (firstVisit) {
      elements = <h1>Привет! Введи название фильма</h1>;
    } else if (!firstVisit && movies === undefined) {
      elements = <h1>По вашему запросу ничего не найдено!</h1>;
    } else if (!error && movies !== undefined) {
      elements = movies.map((movie) => {
        return (
          <Movie
            key={movie.id}
            posterLink={movie.posterLink}
            title={movie.title}
            releaseDate={movie.releaseDate}
            overview={movie.overview}
            loading={loading}
          />
        );
      });
    }

    return (
      <div className="app">
        <header className="header">
          <input
            className="header__input"
            placeholder="Type to search..."
            value={searchValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputSubmit}
          ></input>
        </header>
        <main className="main">
          <MovieList loading={loading} elements={elements} tagList={tags} error={error} searchValue={searchValue} />
        </main>
        <footer className="footer"></footer>
      </div>
    );
  }
}
