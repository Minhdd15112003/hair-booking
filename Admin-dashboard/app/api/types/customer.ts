import { Profile } from './profile';

export type TCustomerResponse = {
    id: string; //bỏ qua
    gender: Gender;
    role: Roles;
    full_name: string;
    phone_number: string;
    avatar?: string | null | undefined; // allow null here
    date_of_birth?: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    profile?: Profile;
};

export type TCustomerRequest = {
    id?: string;
    full_name: string;
    gender: string;
    phone_number: string;
    picture?: File | null | undefined; // allow null here
    date_of_birth?: string;
    address?: string;
    profile?: {
        customer?: {
            rank?: string;
            rewards?: number;
        };
    };
};

export type TProfileCustomerRequest = {
    id?: string;
    full_name: string;
    gender: string;
    date_of_birth?: string;
    address?: string;
    profile?: {
        customer?: {
            rank?: string;
            rewards?: number;
        };
    };
};
export type TNumberPhoneCustomerRequest = {
    phone_number: string;
};
