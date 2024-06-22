import {get, patch, post} from './BaseRequests.ts'
import {
    CodeCheckDto,
    JwtAuthenticationResponse,
    PasswordChangeDto,
    PasswordChangeEmailDto,
    SignInUser,
    SignUpUser
} from "../Types/types.ts";

const host: string = import.meta.env.VITE_BACKEND_HOST + "/auth"

const requests = {
    signIn: (value: SignInUser) =>
        post<SignInUser, JwtAuthenticationResponse>(`${host}/sign-in`, value),
    signUp: (value: SignUpUser) =>
        post<SignUpUser, JwtAuthenticationResponse>(`${host}/sign-up`, value),
    sendCode: (email: string) => get<PasswordChangeDto, string>(`${host}/sendCode`, {email}),
    check: (email: string, code: string) => get<CodeCheckDto, boolean>(`${host}/check`, {email, code}),
    editPasswordWithCode: (email: string,
                           confirmation: string,
                           newPassword: string,
                           passwordConfirm: string) =>
        patch<PasswordChangeEmailDto, string>(
            `${host}/editPasswordEmail?email=${email}`,
            {confirmation, newPassword, passwordConfirm}
        ),
}

export default requests