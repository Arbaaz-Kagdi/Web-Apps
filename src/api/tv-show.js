import axios from "axios";
import { MOCK_POPULARS } from "./mock_data"
import { API_KEY_PARAM, BASE_URL } from "../config";

export class TVShowAPI {
    static async fetchPopulars() {
        // const response = await axios.get(`${BASE_URL}tv/popular${API_KEY_PARAM}`);
        // console.log(response.data.results);
        // return response.data.results;
        return MOCK_POPULARS;
    }
}