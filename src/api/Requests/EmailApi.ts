import {get} from "./BaseRequests.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/email"

const request = {
    send: (email: string, hash: string) =>
        get<{email: string, hash: string}, string>(`${host}/htmlEmail`, {email, hash})
}

export default request