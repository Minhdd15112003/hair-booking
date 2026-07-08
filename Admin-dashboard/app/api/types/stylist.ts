// model User {
//   id               String    @id @default(auto()) @map("_id") @db.ObjectId
//   gender           Gender    @default(MALE)
//   role             Roles     @default(CUSTOMER)
//   full_name        String
//   phone_number     String // @unique
//   password         String?
//   avatar           String?
//   date_of_birth    DateTime?
//   address          String?
//   access_token     String?
//   refresh_token    String?
//   deleted          Boolean   @default(false)
//   createdAt        DateTime  @default(now())
//   updatedAt        DateTime  @updatedAt
//   profile          Profile?
//   // is_password_set    Boolean @default(false)
//   customerBookings Booking[] @relation("CustomerBooking")
//   stylistBookings  Booking[] @relation("StylistBooking")
// }

import { Profile } from './profile';

export type TStylistResponse = {
    id: string; //bỏ qua
    gender: Gender;
    role: Roles;
    full_name: string;
    phone_number: string;
    password?: string;
    avatar?: string;
    date_of_birth?: string;
    address: string;
    access_token?: string; //bỏ qua
    refresh_token?: string; //bỏ qua
    deleted: boolean; //bỏ qua
    createdAt: string;
    updatedAt: string;
    profile: {
        stylist?: {
            experience?: string;
            reviews?: number;
            isWorking?: boolean;
        };
    };
};

export type TStylistRequest = {
    gender: string;
    // role: Roles;
    full_name: string;
    phone_number: string;
    avatar?: string;
    date_of_birth?: string;
    address?: string;
    profile: Profile;
};

export type TStylistProfileRequest = {
    gender: string;
    full_name: string;
    date_of_birth?: string;
    address?: string;
    profile: Profile;
};
