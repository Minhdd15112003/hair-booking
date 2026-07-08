import { Constants } from '@/app/constants';
import customFetch from '../instance/fetch';
import { TBookingRequest, TPaymentStatusBooking } from '../types/booking';
import { headers } from 'next/headers';

export const findAllBooking = async () => {
    const data = await customFetch(Constants.Route.booking.find);
    return data;
};

export const findBookingById = async (id: string) => {
    const data = await customFetch(Constants.Route.booking.findOne(id));
    console.log({ data });
    return data;
};

export const createBooking = async (data: TBookingRequest) => {
    const response = await customFetch('/booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
};

export const updateBooking = async (id: string, data: TBookingRequest) => {
    const response = await customFetch(Constants.Route.booking.update(id), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
};

export const updatePaymentStatusBooking = async (id: string, data: any) => {
    console.log({ data });
    const response = await customFetch(
        Constants.Route.booking.updatePaymentStatus(id, data.phone_number, data.payment_status),
        {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // body: JSON.stringify(data),
        },
    );
    return response;
};

export const updateStatusBooking = async (id: string, data: any) => {
    const response = await customFetch(Constants.Route.booking.updateStatus(id, data.phone_number, data.status), {
        method: 'GET',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(data),
    });
    return response;
};

export const deleteBooking = async (id: string) => {
    const data = await customFetch(Constants.Route.booking.delete(id), {
        method: 'DELETE',
    });
    return data;
};
