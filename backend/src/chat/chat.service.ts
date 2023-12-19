import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDTO } from './schemas/chat.schema';
import { ChatAllDTO } from './dtos/chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async create(data: ChatDTO): Promise<Chat> {
    const result = new this.chatModel(data);
    return await result.save();
  }

  async findAllByUser(data: ChatAllDTO): Promise<Chat[]> {
    return await this.chatModel.find({
      $or: [
        { from: data.from, to: data.to },
        { from: data.to, to: data.from },
      ],
    });
  }
}
