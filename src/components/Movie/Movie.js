import React from "react";
import { Rate } from "antd";

import { format } from "date-fns";
import { getColorByRating } from "../../util/helper";

import PropTypes from 'prop-types'

import vadim from "../../resources/Vadim.jpg";

// Импорт стилей
import "./Movie.scss";

class Movie extends React.Component {


  onChangeUserRating = (value) => {
    this.props.onChangeUserRating(this.props.id, value);
  };

  render() {
    const { name, released, genres, image, platforms, rating, userRating, disabledRating } = this.props;
    const { onChangeUserRating } = this;
    const stylesColorRate = {
      border: `3px solid ${getColorByRating(rating)}`,
      borderRadius: "50%",
    };
    return (
      <div className="movie-item">
        <div>
          <img className="movie-image" src={image ? image : vadim} alt={name} />{" "}
        </div>
        <div className="movie-description">
          <div className="movie-description__rating" style={stylesColorRate}>
            <div className="rating">{rating}</div>
          </div>
          <h2 className="movie-description__title">{name}</h2>
          <p className="movie-description__date">{format(released, "MMMM d, yyyy")}</p>
          <ul className="movie-description__genres">
            {genres.map((item, index) => (
              <li className="btn btn-outline-secondary btn-sm" key = {index}>{item}</li>
            ))}
          </ul>
          <ul className="movie-description__content">
            {platforms.map((item, index) => (
              <li className="btn btn-outline-success btn-sm" key = {index}>{item}</li>
            ))}
          </ul>
          <Rate count={5} allowHalf={true} defaultValue={0} onChange={onChangeUserRating} value = {userRating} disabled = {disabledRating} />
        </div>
      </div>
    );
  }
}


Movie.defaultProps = {
  disabledRating: false,
}


export default Movie;
