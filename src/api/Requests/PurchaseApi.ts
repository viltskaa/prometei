import {get, post} from "./BaseRequests.ts";
import {PurchaseCreateDto, PurchaseDto, PurchaseGetDto, UserIdDto} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/purchase"

const request = {
    get: (purchaseId: string) => get<PurchaseGetDto, PurchaseDto>(`${host}/get`, {purchaseId}),
    getByUser: (userId: string) => get<UserIdDto, Array<PurchaseDto>>(`${host}/getByUser?userId=${userId}`),
    create: (data: PurchaseCreateDto) => post<PurchaseCreateDto, string>(`${host}/create`, data),
}

export default request