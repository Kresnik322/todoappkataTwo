class LocalStorageRating {

  // Отдельный массив где храню localStorage. Это нужно для реализации поиска игры в localStorage.
  // По факту является копией localStorage, если в инпут поиска пустой, если инпут не пустой, то хранит те игры, подходящие инпуту
  searchLocalStorage = [];

  // Добавляю игру в localStorage при ее оценке из таба Search
  addItem = (id, info) => {
    localStorage.setItem(id, JSON.stringify(info));
  };

  //Метод, используется при трансформации данных, полученны с сервера. Я сразу проверяю, оценивал ли ее пользователь
  getUserRating = (id) => {
    const gameInfo = JSON.parse(localStorage.getItem(id));
    if (!gameInfo) return 0;
    return gameInfo.userRating;
  };

  // Создаю копию localeStorage, которая хранится в поле класса searchLocalStorage
  getSearchedItems = (str = "") => {
    this.searchLocalStorage = Object.keys(localStorage).filter(
      (item) => JSON.parse(localStorage.getItem(item)).name.indexOf(str) > -1
    );
  };

  // Получаю постраничный список. Возврашаю сам список, и длину списка, для интерфейса Pagination
  getRatingList = (page = 1, pageSize = 6) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const result = this.searchLocalStorage.slice(start, end);
    return [result.map((item) => JSON.parse(localStorage.getItem(item))), this.searchLocalStorage.length];
  };
}

export default LocalStorageRating;
