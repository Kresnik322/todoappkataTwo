import React from "react";
import _ from "lodash";

//Импорт компонентов
import { PageInfo } from "../PageInfo";
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
      this.debounceOnRequest(1, this.props.queryValue);
      this.setState({ page: 1 });
    }

    if (prevState.page !== this.state.page) {
      this.onRequest();
    }
  }
  // отписываемся от debounce обертки
  componentWillUnmount() {
    this.debounceOnRequest.cancel();
  }

  // Делаем запрос на сервер
  onRequest = () => {
    // Устанавливаем вспомогательные блоки в положение по умолчанию перед запросом на сервер
    this.setLoading(true);
    this.onLoadingError(false);
    this.onOnlineError(true);

    this.movieServices
      .getItemResources(this.state.page, PAGE_SIZE, this.props.queryValue)
      .then(this.onLoadingItems)
      .catch((err) => {
        if (!this.navigatorUser.onLine) this.onOnlineError(false);
        else this.onLoadingError(true);
      })
      .finally(() => this.setLoading(false));
  };

  // Обработчик ошибок
  onLoadingError = (logic) => {
    this.setState({ isErrorPage: logic });
  };

  // Дополнительный обработчик ошибки, когда у Юзера нет интернета
  onOnlineError = (logic) => {
    console.log(logic);
    this.setState({ isOnline: logic });
  };

  // Меняем state после загрузки с сервера
  onLoadingItems = (newItems) => {
    this.setState({
      data: [...newItems[0]],
      maxPages: Math.ceil(newItems[1] / PAGE_SIZE),
    });
  };

  //Меняем логическую загрузку
  setLoading = (logic) => {
    this.setState({ isLoadingPage: logic });
  };

  // Изменение страницы.
  onChangePage = (pageNumber) => {
    this.setState({
      page: pageNumber,
    });
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

    const content = !(isLoadingPage || isErrorPage || !isOnline);

    return (
      <>
        {isLoadingPage ? (
          <Spin size="large" tip="Loading...">
            {" "}
          </Spin>
        ) : null}
        {isErrorPage ? <Alert message="ERROR!" description="Что - то пошло не так" type="error" /> : null}
        {!isOnline ? <Alert message="Упс..." description="Интернет - соединение отсутствует" type="warning" /> : null}
        {content && <PageInfo data={data} maxPages={maxPages} onChangeUserRating={onChangeUserRating} />}
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
          />
        </div>
      </>
    );
  }
}



export default MovieList;

