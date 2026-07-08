import { Constants } from '@/app/constants';
import customFetch from '../instance/fetch';
import { headers } from 'next/headers';
import Cookie from 'js-cookie';
import { TStylistProfileRequest, TStylistRequest } from '../types/stylist';

export const findAllStylist = async () => {
    const data = await customFetch(Constants.Route.stylist.find);

    return data;
};

export const findAllStylistWorking = async () => {
    const data = await customFetch(Constants.Route.stylist.find);
    const result = data.data;
    const filteredResult = result.filter(
        (stylelist: { profile: { stylist: { isWorking: boolean } } }) => stylelist.profile?.stylist?.isWorking === true,
    );
    console.log(filteredResult);
    return filteredResult;
};

export const findStylist = async (id: string) => {
    const data = await customFetch(Constants.Route.stylist.findOne(id));
    return data;
};

export const createStylist = async (data: FormData) => {
    await customFetch(Constants.Route.stylist.create, {
        method: 'POST',
        body: data,
    });
};

export const updateProfileStylist = async (id: string, data: TStylistProfileRequest) => {
    const accessToken = Cookie.get('access_token');
    await customFetch(Constants.Route.profile.updateProfile(id), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${accessToken}`,
        },
        body: JSON.stringify(data),
    });
};

export const updateAvatarStylist = async (id: string, data: FormData) => {
    await customFetch(Constants.Route.profile.updateAvatar(id), {
        method: 'PATCH',
        body: data,
    });
};

export const deleteStylist = async (id: string) => {
    await customFetch(Constants.Route.stylist.delete(id), {
        method: 'DELETE',
    });
};
