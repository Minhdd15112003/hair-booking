import { Constants } from '@/app/constants';
import customFetch from '../instance/fetch';

export const findAllCombo = async () => {
    const data = await customFetch(Constants.Route.combo.find);

    return data;
};

export const createCombo = async (data: FormData) => {
    const response = await customFetch(Constants.Route.combo.create, {
        method: 'POST',
        body: data,
    });
    return response;
};
export const updateCombo = async (id: string, data: FormData) => {
    const response = await customFetch(Constants.Route.combo.update(id), {
        method: 'PATCH',
        body: data,
    });
    return response;
};

export const deleteCombo = async (id: string) => {
    const data = await customFetch(Constants.Route.combo.delete(id), {
        method: 'DELETE',
    });
    return data;
};
