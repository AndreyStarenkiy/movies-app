import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import './movie-list.css';

import '../movie/movie';

export default class MovieList extends Component {
  render() {
    const { elements, error, loading } = this.props;

    if (error) {
      return (
        <h1 className="error-message">
          Ain`t nobody here but us chickens! <br></br> API Error{' '}
        </h1>
      );
    }

    if (loading) {
      return <Spin className="app__spin-large" size="large" />;
    }

    return <ul className="movie-list">{elements}</ul>;
  }
}
