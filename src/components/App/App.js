import React from "react";

//Импорт компонентов
import { MovieList } from "../MovieList";
import { SearchPanel } from "../SearchPanel";
import { UserRatingList } from "../UserRatingList";
import { Tabs } from "antd";

import "./App.scss";

class App extends React.Component {
  state = {
    queryValue: "",
    queryValueRatingItems: "",
    updateComponent: false,
  };

  onInputChange = (value, name) => {
    this.setState({ [name]: value });
  };

  // Я думал как заставить компонент UserRatingList обновляться после обновления localStorage, когда поставили оценку
  // Тут заставляю передавать пропс в компонет. Так как каждый раз пропс меняется с тру на фалс и обратно, я таким макаром
  // заставляю обновляться UserRatingList без обновления страницы. Моих знаний хватило только на это, или я чего то не вспомнил
  onUpdateComponent = () => {
    this.setState(({ updateComponent }) => ({
      updateComponent: !updateComponent,
    }));
  };

  render() {
    const { queryValue, updateComponent, queryValueRatingItems } = this.state;
    const { onInputChange, onInputChangeLocalStorage } = this;
    const items = [
      {
        label: "Search",
        key: "1",
        children: (
          <>
            <SearchPanel onInputChange={onInputChange} name ='queryValue' />
            <MovieList queryValue={queryValue} onUpdateComponent={this.onUpdateComponent} />
          </>
        ),
      },
      {
        label: "Rating",
        key: "2",
        children: (
          <>
            <SearchPanel onInputChange={onInputChange} name ='queryValueRatingItems' />
            <UserRatingList queryValueRatingItems={queryValueRatingItems} updateComponent={updateComponent} />
          </>
        ),
      },
    ];

    return (
      <div className="app">
        <Tabs defaultActiveKey="1" items={items} size="large" centered={true} />
      </div>
    );
  }
}

export default App;
