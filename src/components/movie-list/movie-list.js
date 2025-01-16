import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './movie-list.css';

import '../movie/movie';

export default class MovieList extends Component {
  render() {
    const elements = [];

    for (let i = 0; i < 5; i += 1) {
      elements.push(
        <li className="movie">
          <img
            src="https://s3-alpha-sig.figma.com/img/d1ed/f372/ad16f84b4351c548ad40efff6081bd5e?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SY~zqwtWuevknxMEGRpjv9KpB8639SnI0vrgedSHBSdP66mC-G03uQmfHq4lUsmvMRMJ7iFhnd0Y0Hsb0trdApXn6xdI6mLbRcWW-sixTXTy~jlwTEpndWPo69wWtK85kLnfggo-z8zaO9E1OjzGAEUznCRk29DiSNiU8AW6y6Hs8QsNd9sKfhXq70vsSpCcexCEK79LcdAJJs0JgVPnR3MA8XU-yLrpxBmnYXoY3nL9kCJ15n2m4Dd~ekOFngFFgGcz1oJfjVGOijCVrB-4Q9cVWNAvptXcRwtJddl66g9~9yOFVFKe1lcIb2A9Bw~11SNOds90FyFkGSDxQy~2dg__"
            className="movie__poster"
          ></img>
          <div className="movie__info">
            <h3>Movie Name</h3>
            <time>March 5, 2020</time>
            <span className="movie-description"> yadayadayadayadayadayadayadayadayadayadayadayadayada</span>
          </div>
        </li>
      );
    }

    console.log(elements);

    return (
      <ul className="movie-list">
        <li className="movie">
          <img
            src="https://s3-alpha-sig.figma.com/img/d1ed/f372/ad16f84b4351c548ad40efff6081bd5e?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SY~zqwtWuevknxMEGRpjv9KpB8639SnI0vrgedSHBSdP66mC-G03uQmfHq4lUsmvMRMJ7iFhnd0Y0Hsb0trdApXn6xdI6mLbRcWW-sixTXTy~jlwTEpndWPo69wWtK85kLnfggo-z8zaO9E1OjzGAEUznCRk29DiSNiU8AW6y6Hs8QsNd9sKfhXq70vsSpCcexCEK79LcdAJJs0JgVPnR3MA8XU-yLrpxBmnYXoY3nL9kCJ15n2m4Dd~ekOFngFFgGcz1oJfjVGOijCVrB-4Q9cVWNAvptXcRwtJddl66g9~9yOFVFKe1lcIb2A9Bw~11SNOds90FyFkGSDxQy~2dg__"
            className="movie__poster"
          ></img>
          <div className="movie__info">
            <h3>Movie Name</h3>
            <time>March 5, 2020</time>
            <span className="movie-description"> yadayadayadayadayadayadayadayadayadayadayadayadayada</span>
          </div>
        </li>
        {elements}
      </ul>
    );
  }
}
