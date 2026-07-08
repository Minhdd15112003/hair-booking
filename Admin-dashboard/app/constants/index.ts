import { login } from '../api/core/auth';

export class Constants {
    static readonly FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    static readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    static readonly PLACEHOLD_IMAGE = process.env.PLACEHOLD_IMAGE;

    static readonly Route = {
        auth: {
            login: `/auth/login`,
            register: `/auth/register`,
        },
        profile: {
            updateProfile: (id: string) => `/user/${id}`,
            updateAvatar: (id: string) => `/user/update-avatar/${id}`,
            updateNumberPhone: `/user/update-phone-number`,
        },
        stylist: {
            find: `/stylist`,
            findOne: (id: string) => `/stylist/${id}`,
            create: `/stylist`,
            update: (id: string) => `/stylist/${id}`,
            delete: (id: string) => `/stylist/${id}`,
        },
        customer: {
            find: `/customer`,
            banned: `/customer/banned`,
            unBanned: (id: string) => `/customer/${id}/restore`,
            findOne: (id: string) => `/customer/${id}`,
            create: `/customer`,
            update: (id: string) => `/customer/${id}`,
            delete: (id: string) => `/customer/${id}`,
        },
        service: {
            find: `/service`,
            findOne: (id: string) => `/service/${id}`,
            create: `/service`,
            update: (id: string) => `/service/${id}`,
            delete: (id: string) => `/service/${id}`,
        },
        combo: {
            find: `/combo`,
            findOne: (id: string) => `/combo/${id}`,
            create: `/combo`,
            update: (id: string) => `/combo/${id}`,
            delete: (id: string) => `/combo/${id}`,
        },
        booking: {
            find: `/booking`,
            findOne: (id: string) => `/booking/${id}`,
            create: `/booking`,
            update: (id: string) => `/booking/${id}`,
            delete: (id: string) => `/booking/${id}`,
            updateStatus: (id: string, phone_number: string, status: string) =>
                `/booking/change-booking-status?booking_id=${id}&phone=${phone_number}&status=${status}`,

            updatePaymentStatus: (id: string, phone_number: string, payment_status: string) =>
                `/booking/change-booking-payment-status?booking_id=${id}&phone=${phone_number}&payment_status=${payment_status}`,
        },
    };
}
