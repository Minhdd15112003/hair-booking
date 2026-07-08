import { Constants } from '@/app/constants';
import customFetch from '../instance/fetch';
import { TServiceResponse } from '@/app/api/types/service';

export const getListService = async () => {
    const data = await customFetch(Constants.Route.service.find);
    return data;
};

export const findByIdService = async (id: string) => {
    const data = await customFetch(Constants.Route.service.findOne(id));
    return data;
};

export const createService = async (formData: FormData) => {
    const data = await customFetch(Constants.Route.service.create, {
        method: 'POST',
        body: formData,
    });
    console.log('createService', data);
};

export const updateService = async (id: string, formData: FormData) => {
    const data = await customFetch(Constants.Route.service.update(id), {
        method: 'PATCH',
        body: formData,
    });
    console.log('updateService', data);
};

export const deleteService = async (id: string) => {
    const data = await customFetch(Constants.Route.service.delete(id), {
        method: 'DELETE',
    });
};
