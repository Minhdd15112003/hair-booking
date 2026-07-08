import { Constants } from '@/app/constants';
import { TLoginRequest } from '../types/auth';
import customFetch from '../instance/fetch';
// import Cookie from "js-cookie";

// const accessToken = Cookie.get("access_token");
export const login = async (data: TLoginRequest) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${Constants.Route.auth.login}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //   Authorization: `${accessToken}`,
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};
