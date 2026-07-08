import { Profile } from "./profile";

export type TLoginRequest = {
  phone_number: string;
  password: string;
};

export type TLoginResponse = {
  refresh_token: string;
  access_token: string;

  profile: Profile;
  id: string;
  gender: string;
  role: string;
  full_name: string;
  phone_number: string;
  avatar: string | File;
  date_of_birth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  notify_token: string;
};
