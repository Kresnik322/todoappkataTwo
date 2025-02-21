import React from "react";
import { MovieCard } from "../MovieCard";
import { Alert } from "antd";

import "./PageInfo.scss";

const PageInfo = (props) => {
  const { data, maxPages, onChangeUserRating, disabledRating } = props;

  return (
    <>
      {data.length === 0 ? <Alert message="Внимание" description="Результат отсутствует" type="warning" /> : null}
      <div className="count-item mt-3">Всего страниц: {maxPages}</div>
      <div className="movie-list">
        {data.map((item) => (
          <MovieCard {...item} key={item.id} onChangeUserRating={onChangeUserRating} disabledRating={disabledRating} />
        ))}
      </div>
    </>
  );
};

export default PageInfo;