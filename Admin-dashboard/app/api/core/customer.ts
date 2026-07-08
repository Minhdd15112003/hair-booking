import { Constants } from '@/app/constants';
import customFetch from '../instance/fetch';
import { headers } from 'next/headers';
import Cookies from 'js-cookie';
import { TCustomerRequest, TNumberPhoneCustomerRequest, TProfileCustomerRequest } from '../types/customer';

export const findAllCustomer = async () => {
    const data = await customFetch(Constants.Route.customer.find);

    return data;
};

export const findAllBannedCustomer = async () => {
    const data = await customFetch(Constants.Route.customer.banned);
    return data;
};

export const unBannedCustomer = async (id: string) => {
    await customFetch(Constants.Route.customer.unBanned(id), {
        method: 'POST',
    });
};

export const createCustomer = async (formData: FormData) => {
    const response = await customFetch(Constants.Route.customer.create, {
        method: 'POST',

        body: formData,
    });
    return response;
};

export const updateProfileCustomer = async (id: string, data: TProfileCustomerRequest) => {
    await customFetch(Constants.Route.profile.updateProfile(id), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const updateNumberPhoneCustomer = async (id: string, data: TNumberPhoneCustomerRequest) => {
    await customFetch(Constants.Route.profile.updateNumberPhone, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const updateAvatarCustomer = async (id: string, data: FormData) => {
    await customFetch(Constants.Route.profile.updateAvatar(id), {
        method: 'PATCH',
        body: data,
    });
};

export const deleteCustomer = async (id: string) => {
    const data = await customFetch(Constants.Route.customer.delete(id), {
        method: 'DELETE',
    });
    return data;
};
