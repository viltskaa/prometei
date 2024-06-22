import {get} from "./BaseRequests.ts";

interface GeoDecodeParams {
    apikey: string,
    geocode: string
    lang: "ru_RU"
    format: "json"
    results: number
}

const geoDecode = (params: GeoDecodeParams) => get('https://geocode-maps.yandex.ru/1.x', params)

export default geoDecode