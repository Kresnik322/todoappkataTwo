import React from "react";
import { Pagination } from "antd";

import LocalStorageRating from "../../services/LocalStorageRating";
import { PageInfo } from "../MovieList/MovieList";

const PAGE_SIZE = 6;

// ТУТ НЕ ИСПОЛЬЗУЮ ОБЕРТКУ debounce. Так как беру данные с localStorage

class UserRatingList extends React.Component {
  state = {
    data: [],
    page: 1,
    maxPages: 0,
  };

  localStorageRating = new LocalStorageRating();

  componentDidMount() {
    this.localStorageRating.getSearchedItems(); // Сразу копирую localeStorage в отдельный массив
    this.onRequest();
  }

  componentDidUpdate(prevProps, prevState) {
    this.localStorageRating.getSearchedItems(this.props.queryValueRatingItems); // Сразу копирую localeStorage в отдельный массив
    // Компонент обновляется если в табе Search оценена какая либо игра
    if (prevProps.updateComponent !== this.props.updateComponent) {
      this.onRequest(this.state.page);
    }

    // Компонент обновляется, если пользователь введет что то поле инпута

    if (prevProps.queryValueRatingItems !== this.props.queryValueRatingItems) {
      this.setState({ page: 1 });
      this.onRequest(1);
    }
  }

  onRequest = (page = 1) => {
    const newData = this.localStorageRating.getRatingList(page);
    this.onLoadingItems(newData);
  };

  onLoadingItems = (newData) => {
    this.setState({
      data: [...newData[0]],
      maxPages: Math.ceil(newData[1] / PAGE_SIZE),
    });
  };

  onChangePage = (pageNumber) => {
    this.setState({
      page: pageNumber,
    });
    this.onRequest(pageNumber);
  };

  onChangeUserRating = (id, value) => {
    const infoItem = this.localStorageRating.getItem(id);
    infoItem.userRating = value;
    this.localStorageRating.addItem(id, infoItem);
  };

  render() {
    const { data, maxPages, page } = this.state;
    const { onChangePage, onChangeUserRating } = this;
    return (
      <>
        <PageInfo data={data} maxPages={maxPages} onChangeUserRating={onChangeUserRating} disabledRating={true} />
        <div className="pagination">
          <Pagination
            pageSize={PAGE_SIZE}
            total={maxPages * PAGE_SIZE}
            align="center"
            onChange={onChangePage}
            current={page}
          ></Pagination>
        </div>
      </>
    );
  }
}

export default UserRatingList;
