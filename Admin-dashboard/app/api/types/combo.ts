// model Combo {
//   id          String    @id @default(auto()) @map("_id") @db.ObjectId
//   name        String    @unique
//   description String
//   price       String?
//   picture     String?
//   services    String[]
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deleted     Boolean   @default(false)
//   Booking     Booking[]
//   point       Int?       @default(0)
// }

export type TComboResponse = {
  id: string;
  name: string;
  description: string;
  price: string;
  picture: string;
  services: string[];
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  point: number;
};

export type TComboRequest = {
  name: string;
  description: string;
  // price: string;
  picture?: string | File;
  services: string[];
  point?: number;
};
