export default class MoviesdbService {
  apiKey = 'c19eaf9fcc8891ed43f08a9f2631f6f3';
  bearer =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTllYWY5ZmNjODg5MWVkNDNmMDhhOWYyNjMxZjZmMyIsIm5iZiI6MTczNjU0Njg5Ni41MzYsInN1YiI6IjY3ODE5YTUwNjA1NjU4NmY2YzRlNWExNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TUP6NI5qfCxA2e-RvTGoBVTH4hCKaQJFYw9SpXY9GAM';

  async getMovies(keyword, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=${page}`;
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
    return json;
  }

  async createSession() {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `ApiKey ${this.apiKey}`
        }
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`,
        options
      );
      const json = await response.json();

      return json;
    } catch (error) {
      console.error('Ошибка при создании гостевой сессии:', error);
    }
  }

  // не работает))
  /*   async changeRate({ stars, id }) {
    try {
      const guestSession = localStorage.getItem('sessionId');
      const guestSessionJson = JSON.parse(guestSession);
      const guestSessionId = guestSessionJson.guest_session_id;
      console.log('got session', guestSessionId);
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTllYWY5ZmNjODg5MWVkNDNmMDhhOWYyNjMxZjZmMyIsIm5iZiI6MTczNjU0Njg5Ni41MzYsInN1YiI6IjY3ODE5YTUwNjA1NjU4NmY2YzRlNWExNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TUP6NI5qfCxA2e-RvTGoBVTH4hCKaQJFYw9SpXY9GAM',
          body: JSON.stringify({ value: stars })
        }
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
        options
      );
      const result = await response.json();
      console.log('Результат оценки:', result);
    } catch (error) {
      console.error('Ошибка при отправке оценки:', error);
    }
  } */

  async getGenres() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list';
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
      throw new Error('genres not okay');
    }

    const json = await response.json();
    return json;
  }
}
