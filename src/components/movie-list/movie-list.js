import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './movie-list.css';

import '../movie/movie';

export default class MovieList extends Component {
  render() {
    const { tagList, elements } = this.props;

    // console.log(elements);

    return <ul className="movie-list">{elements}</ul>;
  }
}
