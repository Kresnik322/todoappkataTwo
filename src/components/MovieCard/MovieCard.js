import React from "react";
import { Rate } from "antd";

import { format } from "date-fns";
import { getColorByRating } from "../../util/helper";

import PropTypes from "prop-types";

import vadim from "../../resources/Vadim.jpg";

// Импорт стилей
import "./MovieCard.scss";

class Movie extends React.Component {
  static defaultProps = {
    disabledRating: false,
    onChangeUserRating: () => {},
  };

  onChangeUserRating = (value) => {
    this.props.onChangeUserRating(this.props.id, value);
  };

  render() {
    const { name, released, genres, image, platforms, rating, userRating, disabledRating } = this.props;
    const { onChangeUserRating } = this;
    return (
      <div className="movie-item">
        <img className="movie-image" src={image ? image : vadim} alt={name} />{" "}
        <div className="movie-description">
          <div
            className="movie-description__rating"
            style={{
              border: `3px solid ${getColorByRating(rating)}`,
              borderRadius: "50%",
            }}
          >
            <div className="rating">{rating}</div>
          </div>
          <h2 className="movie-description__title">{name}</h2>
          <p className="movie-description__date">{format(released, "MMMM d, yyyy")}</p>
          <ul className="movie-description__genres">
            {genres.map((item, index) => (
              <li className="btn btn-outline-secondary btn-sm" key={index}>
                {item}
              </li>
            ))}
          </ul>
          <ul className="movie-description__content">
            {platforms.map((item, index) => (
              <li className="btn btn-outline-success btn-sm" key={index}>
                {item}
              </li>
            ))}
          </ul>
          <Rate
            count={5}
            allowHalf={true}
            defaultValue={0}
            onChange={onChangeUserRating}
            value={userRating}
            disabled={disabledRating}
          />
        </div>
      </div>
    );
  }
}

export default Movie;
