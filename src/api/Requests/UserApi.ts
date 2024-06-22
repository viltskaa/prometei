import {get, patch} from "./BaseRequests.ts";
import {CheckCodeParams, CodeReturnParams, EditUserDto, UserDto} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/user"

const requests = {
    getCurrent: (jwt: string) =>
        get<null, UserDto>(`${host}/getCurrent`, null, jwt),
    edit: (userId: string, user: EditUserDto, jwt: string) =>
        patch<EditUserDto, string>(`${host}/editUser?userId=${userId}`, user, null, jwt),
    sendCodeReturn: (params: CodeReturnParams) =>
        get<CodeReturnParams, string>(`${host}/sendCodeForReturn`, params),
    checkCodeReturn: (params: CheckCodeParams) =>
        get<CheckCodeParams, boolean>(`${host}/checkCodeForReturn`, params),
    returnTicket: (params: CheckCodeParams, jwt: string) =>
        patch<CheckCodeParams, boolean>(`${host}/returnTicket?code=${params.code}&ticketId=${params.ticketId}`, undefined, null, jwt),
}

export default requests