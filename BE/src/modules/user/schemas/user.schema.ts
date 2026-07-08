// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { AccountRole } from '@prisma/client';
// import { Document, HydratedDocument } from 'mongoose';
// import { AccountType } from 'src/modules/user/enums/account-type.enum';
// import { Gender } from 'src/modules/user/enums/gender.enum';

// export type UserDocument = HydratedDocument<User>;

// @Schema({ timestamps: true })
// export class User extends Document {
//   @Prop({ required: true })
//   full_name: string;

//   @Prop({ unique: true, sparse: true })
//   username?: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ unique: true, sparse: true })
//   phone_number?: string;

//   @Prop()
//   googleId: string;

//   @Prop({ required: false })
//   password: string;

//   @Prop({ enum: Gender, required: false })
//   gender: Gender;

//   @Prop({})
//   avatar: string;

//   @Prop({ enum: AccountRole, default: AccountRole.CUSTOMER })
//   role: AccountRole;

//   @Prop()
//   date_of_birth: string;

//   @Prop({ default: false })
//   email_verified: boolean;

//   @Prop()
//   address: string;

//   @Prop({ enum: AccountType, default: AccountType.BASIC })
//   account_type: AccountType;
// }

// export const UserSchema = SchemaFactory.createForClass(User);
