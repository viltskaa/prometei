import {get, post} from './BaseRequests.ts'
import {MessageDto, PlaceDto, PlaceRequestDto} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/chat"

const requests = {
    getAnswer: (value: MessageDto) =>
        post<MessageDto, string>(`${host}/classification`, value),
    getPlace: (value: PlaceRequestDto) =>
        get<PlaceRequestDto, Array<PlaceDto>>(`${host}/places`, value)
}

export default requests