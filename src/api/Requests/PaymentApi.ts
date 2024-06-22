import {get, patch} from './BaseRequests.ts'

const host: string = import.meta.env.VITE_BACKEND_HOST + "/payment"

const requests = {
    confirm: (hash: string) => patch<null, boolean>(`${host}/confirmPay?paymentHash=${hash}`),
    check: (hash: string) => get<null, string>(`${host}/check?paymentHash=${hash}`),
    cancel: (hash: string) => patch<null, boolean>(`${host}/cancelPay?paymentHash=${hash}`),
}

export default requests