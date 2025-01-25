export default class MoviesdbService {
  async getMovies(keyword) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTllYWY5ZmNjODg5MWVkNDNmMDhhOWYyNjMxZjZmMyIsIm5iZiI6MTczNjU0Njg5Ni41MzYsInN1YiI6IjY3ODE5YTUwNjA1NjU4NmY2YzRlNWExNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TUP6NI5qfCxA2e-RvTGoBVTH4hCKaQJFYw9SpXY9GAM'
      }
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('res is not okay');
    }

    const json = await response.json();
    // const { movies } = json;
    // console.log(json);
    return json;
  }
}
