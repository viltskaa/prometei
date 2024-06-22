import {get, patch, post} from "./BaseRequests.ts";
import {FlightFavorDto, TicketDto} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/ticket"

const requests = {
    getById: (id: string) => get<{ticketId: string}, TicketDto>(`${host}/get`, {ticketId: id}),
    getByUser: (id: string) => get<{userId: string}, Array<TicketDto>>(`${host}/getByUser`, {userId: id}),
    getByPurchase: (id: string) => get<{purchaseId: string}, Array<TicketDto>>(`${host}/getByPurchase`, {purchaseId: id}),
    getByFlight: (id: string) => get<{flightId: string}, Array<TicketDto>>(`${host}/getByFlight`, {flightId: id}),
    getAdditionalFavors: (id: string) => get<{ticketId: string}, Array<FlightFavorDto>>(`${host}/getAdditionalFavors`, {ticketId: id}),
    returnTicket: (id: string) => patch<null, string>(`${host}/returnTicket?ticketId=${id}`, null),
    addAdditionalFavors: (id: string, favors: Array<FlightFavorDto>) =>
        post<Array<FlightFavorDto>, string>(`${host}/addAdditionalFavors?ticketId=${id}`, favors),
}

export default requests