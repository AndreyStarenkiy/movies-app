import React, { Component } from 'react';

import MovieList from '../movie-list/movie-list';
import './app.css';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="header"></header>
        <main className="main">
          <MovieList />
        </main>
        <footer className="footer"></footer>
      </div>
    );
  }
}
