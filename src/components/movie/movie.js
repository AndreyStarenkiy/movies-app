import './movie.css';
import React, { Component } from 'react';
import { Tag, Spin } from 'antd';
import { format, parseISO } from 'date-fns';
import _ from 'lodash';

function truncateOverview(overview) {
  return _.truncate(overview, {
    length: '256',
    separator: ' '
  });
}

function formatDate(dateString) {
  const date = parseISO(dateString);

  return format(date, 'MMMM d, yyyy');
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
    const { id, posterLink, title, releaseDate, overview, loading } = this.state;
    const image =
      posterLink === null ? (
        <Spin />
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original/${posterLink}`}
          alt={`"${title}" poster`}
          className="movie__poster"
        ></img>
      );

    if (loading) {
      return (
        <li className="movie" key={id}>
          <Spin />
        </li>
      );
    }

    return (
      <li className="movie">
        <div className="movie__image-container"> {image} </div>
        <div className="movie__info">
          <h5 className="movie__name">{title}</h5>
          <time className="movie__date">{formatDate(releaseDate)}</time>
          <div className="movie__tag-list">
            <Tag />
          </div>
          <span className="movie-description">{truncateOverview(overview)}</span>
        </div>
      </li>
    );
  }
}
