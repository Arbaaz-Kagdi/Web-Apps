import axios from "axios";
import { BASE_URL } from "../config";

export class MovieAPI {
    static async fetchPopulars() {
        const response = await axios.get(`${BASE_URL}movie/popular?api_key=${import.meta.env.VITE_API_KEY_PARAM}`);
        return response.data.results;
    }

    static async fetchRecommendations(movieId) {
        const response = await axios.get(
            `${BASE_URL}movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_API_KEY_PARAM}`
        );
        return response.data.results;
    }

    static async fetchByTitle(title) {
        const response = await axios.get(
            `${BASE_URL}search/movie?api_key=${import.meta.env.VITE_API_KEY_PARAM}&query=${title}`
        );
        return response.data.results;
    }

    static async fetchVideos(movieId) {
        const response = await axios.get(
            `${BASE_URL}movie/${movieId}/videos?api_key=${import.meta.env.VITE_API_KEY_PARAM}`
        );
        return response.data.results;
    }

    static async fetchWatchProviders(movieId) {
        const response = await axios.get(
            `${BASE_URL}movie/${movieId}/watch/providers?api_key=${import.meta.env.VITE_API_KEY_PARAM}`
        );
        return response.data.results;
    }
}
