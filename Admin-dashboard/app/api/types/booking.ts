export type TBookingResponse = {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    full_name: string;
    phone_number: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    combo: {
        services: {
            id: string;
            name: string;
            price: string;
            description: string;
            picture: string | null;
            total_time: string | null;
            createdAt: string;
            updatedAt: string;
            deleted: boolean;
        }[];
        id: string;
        name: string;
        description: string;
        picture: string;
    };
    customer: {
        id: string;
        gender: string;
        role: string;
        full_name: string;
        phone_number: string;
        avatar: string | null;
        date_of_birth: string | null;
        address: string | null;
        profile: string | null;
        createdAt: string;
        updatedAt: string;
    };
    stylist: {
        id: string;
        gender: string;
        role: string;
        full_name: string;
        phone_number: string;
        avatar: string;
        date_of_birth: string | null;
        address: string | null;
        profile: {
            customer: string | null;
            stylist: {
                experience: string;
                reviews: number;
                isWorking: boolean;
            };
        };
        createdAt: string;
        updatedAt: string;
    };
    total_time: number;
    total_price: number;
};

export type TBookingRequest = {
    start_time: string | Date;
    end_time: string | Date;
    combo_id: string;
    customer_id?: string;
    stylist_id: string;
    status: string;
    full_name?: string;
    phone_number?: string;
};
export type TPaymentStatusBooking = {
    status_payment: string;
};
