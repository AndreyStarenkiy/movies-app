import './movie.css';
import React, { Component } from 'react';
import { Tag } from 'antd';
import _ from 'lodash';

function truncateOverview(overview) {
  return _.truncate(overview, {
    length: '256',
    separator: ' '
  });
}

export default class Movie extends Component {
  state = {
    id: this.props.id,
    posterLink: this.props.posterLink,
    title: this.props.title,
    releaseDate: this.props.releaseDate,
    overview: this.props.overview
  };

  render() {
    const { id, posterLink, title, releaseDate, overview } = this.state;

    return (
      <li className="movie" key={id}>
        <img
          src={`https://image.tmdb.org/t/p/original/${posterLink}`}
          alt={`"${title}" poster`}
          className="movie__poster"
        ></img>
        <div className="movie__info">
          <h5 className="movie__name">{title}</h5>
          <time className="movie__date">{releaseDate}</time>
          <div className="movie__tag-list">
            <Tag />
          </div>
          <span className="movie-description">{truncateOverview(overview)}</span>
        </div>
      </li>
    );
  }
}
