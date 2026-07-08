export type TServiceResponse = {
    time: any;
    id: string;
    name: string;
    price: string;
    description: string;
    picture: string;
    createdAt: string;
    updatedAt: string;
    total_time: string;
    deleted?: boolean;
};

export type TServiceRequest = {
    name: string;
    price: string;
    description: string;
    picture: string | File;
    time: number | null;
};
