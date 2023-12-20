import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatDTO } from './schemas/chat.schema';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { Types } from 'mongoose';

const options = {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
};
@WebSocketGateway(options)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  socketIds: any[] = [];

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    this.logger.debug(`Socket Server onModuleInit`);
    this.socketIds = [];
  }

  async handleConnection(client: any, ...args: any[]) {
    this.logger.debug(`${client.id} is connected...`);
    try {
      const decodedToken = await this.authService.verifyJwt(
        client.handshake.query?.token,
      );
      if (!decodedToken.user) {
        return this.disconnect(client);
      } else {
        // client.data.user = user;

        // Save connection
        this.socketIds.push({ socketId: client.id, user: decodedToken.user });
        // Only emit online to the specific connected client
        for (let index = 0; index < this.socketIds.length; index++) {
          const element = this.socketIds[index];
          this.server.to(element.socketId).emit('online', decodedToken.user);
        }
        return 'success';
      }
    } catch {
      return this.disconnect(client);
    }
  }
  handleDisconnect(client: any) {
    this.logger.debug(`${client.id} is disconnected...`);
    const findIndex = this.socketIds.findIndex(
      (obj) => obj.socketId === client.id,
    );
    if (findIndex !== -1) {
      const user = this.socketIds[findIndex].user;
      for (let index = 0; index < this.socketIds.length; index++) {
        const element = this.socketIds[index];
        if (element.user._id !== user._id) {
          this.server.to(element.socketId).emit('offline', user);
        }
      }
      this.socketIds.splice(findIndex, 1);
    }
  }
  afterInit(server: any) {
    this.logger.debug(`Socket Server Init`);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('messageSend')
  async messageSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatDTO,
  ): Promise<void> {
    this.logger.debug(`${client.id} messageSend ${JSON.stringify(payload)}`);

    const messageData = {
      from: payload.from,
      to: payload.to,
      message: payload.message,
    } as ChatDTO;
    const res = await this.chatService.create(messageData);

    console.log(this.socketIds);
    const findIndex = this.socketIds.findIndex(
      (obj) => obj.user.email === messageData.to,
    );
    console.log('findIndex', findIndex);
    if (findIndex !== -1) {
      const userTo = this.socketIds[findIndex];
      this.server.to(userTo.socketId).emit('messageReceive', res);
    }
  }
}
