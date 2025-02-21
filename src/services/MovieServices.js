
import LocalStorageRating from "./LocalStorageRating";

const localStorageRating = new LocalStorageRating();

class MovieServices {
  _API_Base = "https://api.rawg.io/api/games";
  _API_Key = "477f6980c8f9473093eb192901d359c9";
  _API_defaultPage = 1;
  _API_defaultPageSize = 6;

  getResources = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    return res.json();
  };

  getItemResources = async (page = this._API_defaultPage, pageSize = this._API_defaultPageSize, name = "") => {
    const url = `${this._API_Base}?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(name)}&key=${
      this._API_Key
    }`;
    const res = await this.getResources(url);
    return [res.results.map((item) => this._transformData(item)), res.count];
  };

  _transformData = (data) => {
    const { id, name, released, rating, genres, background_image, platforms } = data;
    return {
      id: id,
      name: name,
      released: released,
      rating: rating.toFixed(1),
      genres: genres.map((item) => item.name),
      image: background_image,
      platforms: platforms.map((item) => item.platform.name),
      userRating: localStorageRating.getUserRating(id), // сразу же смотрим в LocaleStorage, и если игра оценена, получаем ее оценку
    };
  };
}

export default MovieServices;
