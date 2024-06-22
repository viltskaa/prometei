import {get, patch, post} from './BaseRequests.ts'
import {
    Airport,
    FlightClientViewDto,
    FlightFavorDto,
    FlightIdDto,
    SearchDto,
    SearchViewDto
} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/flight"

const requests = {
    search: (value: SearchDto) =>
        get<SearchDto, Array<SearchViewDto>>(`${host}/search`, value),
    getFlight: (id: string) =>
        get<FlightIdDto, FlightClientViewDto>(`${host}/get`, {flightId: id}),
    getFlightFavors: (id: string) =>
        get<FlightIdDto, Array<FlightFavorDto>>(`${host}/getFlightFavors`, {flightId: id}),
    getAirports: () =>
        get<null, Array<Airport>>(`${host}/getAirports`),
    all: () =>
        get<null, Array<FlightClientViewDto>>(`${host}/all`),
    edit: () =>
        patch(`${host}/edit`),
    create: () =>
        post(`${host}/create`),
    addFlightFavors: () =>
        post(`${host}/addFlightFavors`),
}

export default requests