import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
})
export class Chat extends Document {
  @Prop({
    type: String,
  })
  from: string;

  @Prop({
    type: String,
  })
  to: string;

  @Prop({
    type: String,
  })
  message: string;

  @Prop({
    type: Date,
  })
  createTime: Date;

  @Prop({
    type: Date,
  })
  updateTime: Date;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);

export type ChatDTO = Chat;
