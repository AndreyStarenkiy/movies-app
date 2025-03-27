import './movie.css';
import React, { Component, createRef } from 'react';
import { Tag, Spin, Rate } from 'antd';
import { format, parseISO } from 'date-fns';
import _ from 'lodash';

function truncateOverview(overview, limit) {
  return _.truncate(overview, {
    length: limit,
    separator: ' '
  });
}

function formatDate(dateString) {
  if (dateString === '') {
    return null;
  }

  const date = parseISO(dateString);
  return format(date, 'MMMM d, yyyy');
}

export default class Movie extends Component {
  state = {
    id: this.props.id,
    posterLink: this.props.posterLink,
    title: this.props.title,
    releaseDate: this.props.releaseDate,
    overview: this.props.overview,
    starColor: '#fadb14',
    truncateLimit: 180,
    stars: this.props.stars
  };

  titleEl = createRef();

  tagsEl = createRef();

  voteScoreEl = createRef(null);

  componentDidMount = () => {
    const overviewHeight = this.titleEl.current.offsetHeight;
    const tagsHeight = this.tagsEl.current.offsetHeight;

    const { voteScore } = this.props;

    if (this.state.isInRated && this.state.stars !== null) {
      this.setState({ stars: this.state.stars });
    }

    if (overviewHeight + tagsHeight > 140) {
      this.setState({ truncateLimit: 70 });
    } else if (overviewHeight + tagsHeight > 110) {
      this.setState({ truncateLimit: 100 });
    } else if (overviewHeight + tagsHeight > 90) {
      this.setState({ truncateLimit: 140 });
    } else {
      this.setState({ truncateLimit: 180 });
    }

    switch (true) {
      case voteScore > 7:
        this.voteScoreEl.current.style.setProperty('--before-color', '#66E900');
        break;
      case voteScore > 5:
        this.voteScoreEl.current.style.setProperty('--before-color', '#E9D100');
        break;
      case voteScore > 3:
        this.voteScoreEl.current.style.setProperty('--before-color', '#E97E00');
        break;
      case voteScore > 0:
        this.voteScoreEl.current.style.setProperty('--before-color', '#E90000');
        break;
      default:
        this.voteScoreEl.current.style.setProperty('--before-display', 'none');
        break;
    }
  };

  handleStarHover = (star) => {
    switch (true) {
      case star > 7:
        this.setState({ starColor: '#66E900' });
        break;
      case star > 5:
        this.setState({ starColor: '#E9D100' });
        break;
      case star > 3:
        this.setState({ starColor: '#E97E00' });
        break;
      case star > 0:
        this.setState({ starColor: '#E90000' });
        break;
      default:
        this.setState({ starColor: '#fadb14' });
        break;
    }
  };

  handleRate = ({ stars, title, releaseDate, genresIds, overview, posterLink, id, truncateLimit, voteScore }) => {
    this.setState({ stars });
    const ratedMovies = JSON.parse(localStorage.getItem('rated'));

    if (stars === 0) {
      const newArr = ratedMovies.filter((movie) => movie.id !== id);
      localStorage.setItem('rated', JSON.stringify(newArr));

      return;
    }

    if (ratedMovies !== null) {
      let ratedFound = false;

      const newArr = ratedMovies.map((movie) => {
        if (movie.id === id) {
          ratedFound = true;

          return {
            ...movie,
            stars
          };
        }

        return movie;
      });

      if (!ratedFound) {
        newArr.unshift({
          title,
          releaseDate,
          genresIds,
          overview,
          isInRated: true,
          posterLink,
          id,
          truncateLimit,
          stars,
          voteScore
        });
      }

      localStorage.setItem('rated', JSON.stringify(newArr));
    } else {
      const rateThis = {
        title,
        releaseDate,
        genresIds,
        overview,
        isInRated: true,
        posterLink,
        id,
        truncateLimit,
        stars,
        voteScore
      };
      localStorage.setItem('rated', JSON.stringify([rateThis]));
    }
  };

  render() {
    const { id, posterLink, title, releaseDate, overview, loading, starColor, truncateLimit, stars } = this.state;
    const { allGenres, genresIds, voteScore } = this.props;

    const date = releaseDate ? formatDate(releaseDate) : null;
    const voteScoreFloored = voteScore ? voteScore.toFixed(1) : null;
    let voteColor;
    let tags = [];

    const image =
      posterLink === null ? (
        <>
          <Spin />
          <span>Постер не найден :(</span>
        </>
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

    if (genresIds && allGenres) {
      tags = allGenres.reduce((elements, obj) => {
        if (genresIds.includes(obj.id)) {
          elements.push(<Tag key={obj.id}> {obj.name} </Tag>);
        }

        return elements;
      }, []);
    }

    return (
      <li className="movie">
        <div className="movie__image-container"> {image} </div>
        <div className="movie__info">
          <h5 className="movie__name" ref={this.titleEl}>
            {title}
          </h5>
          <time className="movie__date">{date}</time>
          <div className="movie__tag-list" ref={this.tagsEl}>
            {tags}
          </div>
          <div className="rate-view-container">
            <span className="movie-description">{truncateOverview(overview, truncateLimit)}</span>
            <Rate
              style={{
                color: starColor,
                marginTop: 'auto',
                padding: '5px 0',
                fontSize: 19
              }}
              count={10}
              allowHalf={true}
              onHoverChange={this.handleStarHover}
              onChange={(value) =>
                this.handleRate({
                  title,
                  releaseDate,
                  genresIds,
                  overview,
                  posterLink,
                  id,
                  truncateLimit,
                  stars: value,
                  voteScore
                })
              }
              value={stars}
            />
          </div>
          <span className="rating" ref={this.voteScoreEl} style={{ backgroundColor: voteColor }}>
            {voteScoreFloored}
          </span>
        </div>
      </li>
    );
  }
}
