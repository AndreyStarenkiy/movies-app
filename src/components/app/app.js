import React, { Component } from 'react';
import { Pagination, Tabs } from 'antd';
import _ from 'lodash';

import Movie from '../movie/movie';
import MovieList from '../movie-list/movie-list';
import MoviesdbService from '../../services/moviedbService/moviesdbService';
import { GenresConsumer, GenresProvider } from '../movie-genres-context';
import './app.css';

export default class App extends Component {
  state = {
    tabs: {
      currentTab: 'search',
      showRated: false
    },
    rated: [],
    showRated: false,
    movies: undefined,
    loading: false,
    error: false,
    searchValue: '',
    didSearch: '',
    firstVisit: true,
    currentPage: 1,
    currentRatedPage: 1,
    totalMovies: null,
    pageSize: 20,
    genres: null
  };

  MoviesdbService = new MoviesdbService();

  getMoviesInfo = (searchValue, page = 1) => {
    this.setState({ loading: true });
    if (searchValue !== '' && (this.state.didSearch !== this.state.searchValue || page !== this.state.currentPage)) {
      this.MoviesdbService.getMovies(searchValue, page)
        .then((res) => {
          if (res.total_results === 0) {
            this.setState({
              movies: undefined,
              loading: false,
              firstVisit: false,
              currentPage: 1
            });
          } else {
            let movies = [];

            movies = res.results.map((movie) => {
              let rating = 0;

              if (JSON.parse(localStorage.getItem('rated')) !== null) {
                const savedMovies = JSON.parse(localStorage.getItem('rated'));
                const alreadyRated = savedMovies.find((savedMovie) => savedMovie.id === movie.id);

                rating = alreadyRated ? alreadyRated.stars : 0;
              }

              return {
                title: movie.title,
                releaseDate: movie.release_date,
                genres: movie.genre_ids,
                overview: movie.overview,
                posterLink: movie.poster_path,
                id: movie.id,
                userRating: rating,
                voteScore: movie.vote_average
              };
            });

            this.setState({
              movies,
              loading: false,
              firstVisit: false,
              totalMovies: res.total_results,
              didSearch: searchValue
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            error: true,
            loading: false
          });
        });
    } else {
      this.setState({
        error: false,
        loading: false,
        firstVisit: false,
        didSearch: ''
      });
    }
  };

  componentDidMount = () => {
    // localStorage.clear();
    const { Provider } = React.createContext();
    this.MoviesdbService.getGenres()
      .then(({ genres }) => {
        this.setState({ genres });
      })
      .catch((e) => {
        this.setState({ genres: null });
        console.error(e);
      });

    if (localStorage.getItem('sessionId') === null || Date.now() - localStorage.getItem('sessionStart') > 86400000) {
      this.MoviesdbService.createSession().then((res) => {
        localStorage.setItem('sessionId', JSON.stringify(res));
        localStorage.setItem('sessionStart', Date.now());
      });
    }
  };

  handleInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handleInputSubmit = (e) => {
    if (e.key === 'Enter' && this.state.didSearch !== this.state.searchValue) {
      this.getMoviesInfo(this.state.searchValue);
    }
  };

  handlePageButton = (page) => {
    if (this.state.tabs.currentTab === 'search') {
      this.setState({ currentPage: page });
      this.getMoviesInfo(this.state.searchValue, page);
    } else if (this.state.tabs.currentTab === 'rated') {
      this.setState({ currentRatedPage: page });
    }
  };

  onSearch = (e) => {
    this.setState({ searchValue: e.target.value });
    this.debouncedGetMoviesInfo(e.target.value, 1);
  };

  onTabClick = (string) => {
    this.setState({ tabs: { currentTab: string } });
  };

  debouncedGetMoviesInfo = _.debounce(this.getMoviesInfo, 2000);

  render() {
    const { movies, loading, error, searchValue, firstVisit, currentPage, currentRatedPage, totalMovies, pageSize } =
      this.state;
    const { currentTab } = this.state.tabs;

    const ratedMovies = JSON.parse(localStorage.getItem('rated'));

    let elements = [];

    const pagination =
      !firstVisit && !loading && !error && movies !== undefined && currentTab === 'search' ? (
        <Pagination
          total={totalMovies}
          defaultCurrent={1}
          current={currentPage} // Current active page
          onChange={this.handlePageButton} // Callback for page change
          pageSize={pageSize} // Affects number of page buttons displayed
          hideOnSinglePage={true}
          showSizeChanger={false}
        />
      ) : null;

    const ratedPagination =
      currentTab === 'rated' && ratedMovies !== null ? (
        <Pagination
          total={ratedMovies.length}
          defaultCurrent={1}
          current={currentRatedPage} // Current active page
          onChange={this.handlePageButton} // Callback for page change
          pageSize={pageSize} // Affects number of page buttons displayed
          hideOnSinglePage={true}
          showSizeChanger={false}
        />
      ) : null;

    switch (true) {
      case currentTab === 'rated':
        if (localStorage.getItem('rated') === null) {
          break;
        }

        for (let i = 20 * currentRatedPage - 20; i < 20 * currentRatedPage; i += 1) {
          if (ratedMovies[i] === undefined) {
            break;
          }

          elements.push(
            <GenresProvider value={this.state.genres} key={ratedMovies[i].id}>
              <Movie
                key={ratedMovies[i].id}
                id={ratedMovies[i].id}
                posterLink={ratedMovies[i].posterLink}
                title={ratedMovies[i].title}
                releaseDate={ratedMovies[i].releaseDate}
                overview={ratedMovies[i].overview}
                genresIds={ratedMovies[i].genresIds}
                allGenres={this.state.genres}
                loading={loading}
                stars={ratedMovies[i].stars}
                voteScore={ratedMovies[i].voteScore}
              />
            </GenresProvider>
          );
        }
        break;
      case firstVisit:
        elements = <h1>Привет! Введи название фильма</h1>;
        break;
      case !firstVisit && movies === undefined:
        elements = <h1>По вашему запросу ничего не найдено!</h1>;
        break;
      case currentTab === 'search' && !error && movies !== undefined: {
        elements = movies.map((movie) => {
          const wasRated = ratedMovies ? ratedMovies.find((ratedMovie) => ratedMovie.id === movie.id) : false;
          const stars = wasRated ? wasRated.stars : 0;
          return (
            // ##### Контекст есть, и я его понимаю, но для него нет места в моём приложении, так как
            // ##### я создаю массив компонентов внутри app.js.
            // ##### Предыдущий ментор сказал мне, что хранить логику нужно внутри app.js, а дочерний MovieList
            // ##### (или например TodoList) в таком случае используется только лишь для рендера массива компонентов.
            // #####
            // ##### Уточни пожалуйста в комментарии как лучше поступать, где хранить такую логику, как movies.map() 🙏
            // eslint-disable-next-line
            <GenresProvider value={this.state.genres} key={movie.id}>
              <Movie
                key={movie.id}
                id={movie.id}
                posterLink={movie.posterLink}
                title={movie.title}
                releaseDate={movie.releaseDate}
                overview={movie.overview}
                genresIds={movie.genres}
                allGenres={this.state.genres}
                loading={loading}
                stars={stars}
                voteScore={movie.voteScore}
              />
            </GenresProvider>
          );
        });
        break;
      }
      default:
    }

    return (
      <div className="app">
        <header className="header">
          <div className="tabs-container">
            <Tabs
              style={{ margin: '16px 0 0 0' }}
              size="large"
              tabBarGutter={16}
              className="header-tabs"
              activeKey={currentTab}
              onChange={this.onTabClick}
              centered={true}
              tabPosition="top"
              items={[
                {
                  key: 'search',
                  label: ' Search '
                },
                {
                  key: 'rated',
                  label: ' Rated '
                }
              ]}
            />
          </div>
          {currentTab === 'search' ? (
            <input
              className="header__input"
              placeholder="Type to search..."
              value={searchValue}
              onChange={this.onSearch}
              onKeyDown={this.handleInputSubmit}
            ></input>
          ) : null}
        </header>
        <main className="main">
          <MovieList loading={loading} elements={elements} error={error} />
        </main>
        <footer className="footer">{currentTab === 'search' ? pagination : ratedPagination}</footer>
      </div>
    );
  }
}
