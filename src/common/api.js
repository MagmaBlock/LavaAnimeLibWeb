import axios from "axios";
import config from "./config";

export const LavaAnimeAPI = axios.create({
    baseURL: config.api.lavaAnime
})