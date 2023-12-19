import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
})
export class User extends Document {
  @Prop({
    type: String,
  })
  username: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: Date,
  })
  createTime: Date;

  @Prop({
    type: Date,
  })
  updateTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDTO = User;
