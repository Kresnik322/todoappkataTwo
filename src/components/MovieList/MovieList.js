import React from "react";
import _ from "lodash";

//Импорт компонентов
import Movie from "../Movie/Movie";
import MovieServices from "../../services/MovieServices";
import LocalStorageRating from "../../services/LocalStorageRating";
import { Pagination, Spin, Alert } from "antd";

// Импорт стилей
import "./MovieList.scss";

const PAGE_SIZE = 6;


class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.debounceOnRequest = _.debounce(this.onRequest, 1000); // Оборачиваем в обертку debounce запрос на сервер по поиску
  }

  state = {
    page: 1,
    totalPage: 5,
    data: [],
    isLoadingPage: true, // Идет ли загрузка
    isErrorPage: false,
    isOnline: true, // Есть ли сеть у пользователя
    maxPages: 0, // количество итемов по запросу, нужна чтобы ограничить в компоненте Pagination количество страниц
  };

  movieServices = new MovieServices();
  navigatorUser = window.navigator;
  localStorageRating = new LocalStorageRating();

  // при монтировании компонента делаем запрос на сервер с дефолтным значением page = 1
  componentDidMount() {
    this.onRequest();
  }

  // Обновляем компонент, если у нас в строку поиска что то введено
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.queryValue !== this.props.queryValue) {
      this.setLoadingTrue();
      this.debounceOnRequest(1, this.props.queryValue);
      this.setState({ page: 1 });
    }
  }
  // отписываемся от debounce обертки
  componentWillUnmount() {
    this.debounceOnRequest.cancel();
  }

  // Делаем запрос на сервер
  onRequest = (page = 1) => {
    this.movieServices
      .getItemResources(page, PAGE_SIZE, this.props.queryValue)
      .then(this.onLoadingItems)
      .catch((err) => {
        if (!this.navigatorUser.onLine) this.onOnlineError();
        else this.onLoadingError();
      });
  };

  // Обработчик ошибок
  onLoadingError = () => {
    this.setState({ isErrorPage: true, isLoadingPage: false });
  };

  // Дополнительный обработчик ошибки, когда у Юзера нет интернета
  onOnlineError = () => {
    this.setState({ isErrorPage: false, isLoadingPage: false, isOnline: false });
  };

  // Меняем state после загрузки с сервера
  onLoadingItems = (newItems) => {
    this.setState({
      data: [...newItems[0]],
      isLoadingPage: false,
      isErrorPage: false,
      maxPages: Math.ceil(newItems[1] / PAGE_SIZE),
    });
  };

  //Меняем логическую загрузку на true ( isOnline меняется на тру на всякий случай, вдруг у Юзера нет инета, а потом появляется)
  setLoadingTrue = () => {
    this.setState({ isLoadingPage: true, isOnline: true });
  };

  // Изменение страницы.
  onChangePage = (pageNumber) => {
    this.setLoadingTrue();
    this.setState({
      page: pageNumber,
    });
    this.onRequest(pageNumber);
  };

  // Пользователь поставил оценку, тут же добавляю в Local Storage
  onChangeUserRating = (id, userRating) => {
    this.props.onUpdateComponent(); // Заставляю обновляться компонент UserRatingList, чтобы изменения в LocalStorage отображалсиь без обновления страницы
    this.setState(({ data }) => {
      const newItem = data.map((item) => {
        if (item.id === id) {
          this.localStorageRating.addItem(id, { ...item, userRating });
          return { ...item, userRating };
        } else return item;
      });
      return {
        data: [...newItem],
      };
    });
  };

  render() {
    const { onChangePage, onChangeUserRating } = this;
    const { page, data, isLoadingPage, isErrorPage, isOnline, maxPages } = this.state;

    const loading = isLoadingPage ? (
      <Spin size="large" tip="Loading...">
        {" "}
      </Spin>
    ) : null;

    const error = isErrorPage ? <Alert message="ERROR!" description="Что - то пошло не так" type="error" /> : null;

    const notOnline = !isOnline ? (
      <Alert message="Упс..." description="Интернет - соединение отсутствует" type="warning" />
    ) : null;

    const content = !(isLoadingPage || isErrorPage || !isOnline) ? (
      <PageInfo data={data} maxPages={maxPages} onChangeUserRating={onChangeUserRating} />
    ) : null;

    return (
      <>
        {loading}
        {error}
        {notOnline}
        {content}
        <div className="pagination">
          <Pagination
            pageSize={PAGE_SIZE}
            showQuickJumper
            showSizeChanger={false}
            total={maxPages * PAGE_SIZE}
            align="center"
            onChange={onChangePage}
            current={page}
            disabled={isLoadingPage}
          ></Pagination>
        </div>
      </>
    );
  }
}

const PageInfo = (props) => {
  const { data, maxPages, onChangeUserRating, disabledRating } = props;
  const movieList = data.map((item) => (
    <Movie {...item} key={item.id} onChangeUserRating={onChangeUserRating} disabledRating={disabledRating} />
  ));
  const notFoundItems =
    data.length === 0 ? <Alert message="Внимание" description="Результат отсутствует" type="warning" /> : null;
  return (
    <>
      {notFoundItems}
      <div className="count-item mt-3">Всего страниц: {maxPages}</div>
      <div className="movie-list">{movieList}</div>
    </>
  );
};

export default MovieList;

export { PageInfo };
