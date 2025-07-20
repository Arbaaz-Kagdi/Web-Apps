import axios from "axios";
import { MOCK_POPULARS, MOCK_RECOMMENDATIONS } from "./mock_data";
import { BASE_URL } from "../config";

export class TVShowAPI {
  static async fetchPopulars() {
    const response = await axios.get(`${BASE_URL}tv/popular?api_key=${import.meta.env.VITE_API_KEY_PARAM}`);
    // console.log(response.data.results);
    return response.data.results;
    // return MOCK_POPULARS;
  }

  static async fetchRecommendations(tvShowId) {
    const response = await axios.get(
      `${BASE_URL}tv/${tvShowId}/recommendations?api_key=${import.meta.env.VITE_API_KEY_PARAM}`
    );
    return response.data.results;
    // return MOCK_RECOMMENDATIONS;
  }

  static async fetchByTitle(title) {
    const response = await axios.get(
      `${BASE_URL}search/tv?api_key=${import.meta.env.VITE_API_KEY_PARAM}&query=${title}`
    );
    return response.data.results;
    // return MOCK_RECOMMENDATIONS;
  }
}
