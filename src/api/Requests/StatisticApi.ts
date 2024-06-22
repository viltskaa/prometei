import {get} from "./BaseRequests.ts";
import {
    AirplaneModel,
    HeatMapDto,
    HeatMapParamsDto, PopularFavorDto,
    DateParamsDto,
    QuestionCountDto,
    RouteDto, AverageCostDto, AgeTicketDto, CountSalesDto
} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/statistic"

const request = {
    heatMap: (userId: string, airplaneModel: AirplaneModel) => get<HeatMapParamsDto, Array<HeatMapDto>>(`${host}/heatMap`, {userId, airplaneModel}),
    topRoute: () => get<null, Array<RouteDto>>(`${host}/topRoute`),
    questionCount: () => get<null, QuestionCountDto>(`${host}/questionCount`),
    popularFavor: (params: DateParamsDto) => get<DateParamsDto, PopularFavorDto>(`${host}/popularFavor`, params),
    countSale: (params: DateParamsDto) => get<DateParamsDto, CountSalesDto>(`${host}/countSales`, params),
    averageCost: () => get<null, AverageCostDto>(`${host}/averageCost`),
    ageTicket: () => get<null, AgeTicketDto>(`${host}/ageTicket`),
}

export default request