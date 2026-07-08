export type Profile = {
  customer?: CustomerProfile; // bỏ qua
  stylist?: Stylist;
};
export type CustomerProfile = {
  rank: string;
  rewards: number;
};

export type Stylist = {
  experience?: string;
  reviews?: number;
  isWorking?: boolean | undefined;
};
