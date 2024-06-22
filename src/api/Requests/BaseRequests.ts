import axios, {AxiosHeaders, AxiosResponse} from 'axios';

const isNullOrUndefined = (value: unknown | null | undefined) => value === undefined || value === null;

interface Error {
    code: string | unknown;
    message?: string;
}

const get = async <DataType extends object | null, ReturnType> (
    url: string,
    params: DataType | undefined = undefined,
    jwt: string | undefined | null = undefined,
) : Promise<ReturnType | Error> => {
    try {
        const {data} : AxiosResponse<ReturnType> = await axios.get(url, {
            params,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": !isNullOrUndefined(jwt) && `Bearer ${jwt}`,
            }
        })
        return data;
    } catch (error) {
        return {
            code: axios.isAxiosError(error) ? error.code : error,
            message: axios.isAxiosError(error) ? error.message : "",
        };
    }
}

const post = async <DataType extends object | null, ReturnType> (
    url: string,
    params: DataType | undefined = undefined,
    headers: AxiosHeaders | object | undefined | null = undefined,
    jwt: string | undefined | null = undefined,
) : Promise<ReturnType | Error> => {
    try {
        const {data} : AxiosResponse<ReturnType> = await axios.post(url, params,{
            headers: headers || {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: !isNullOrUndefined(jwt) && `Bearer ${jwt}`,
            }
        })
        return data;
    } catch (error) {
        return {
            code: axios.isAxiosError(error) ? error.code : error,
            message: axios.isAxiosError(error) ? error.message : "",
        };
    }
}

const patch = async <DataType extends object | null, ReturnType> (
    url: string,
    params: DataType | undefined = undefined,
    headers: AxiosHeaders | object | undefined | null = undefined,
    jwt: string | undefined | null = undefined,
) : Promise<ReturnType | Error> => {
    try {
        const {data} : AxiosResponse<ReturnType> = await axios.patch(url, params,{
            headers: headers || {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: !isNullOrUndefined(jwt) && `Bearer ${jwt}`,
            }
        })
        return data;
    } catch (error) {
        return {
            code: axios.isAxiosError(error) ? error.code : error,
            message: axios.isAxiosError(error) ? error.message : "",
        };
    }
}

export {get, post, patch}