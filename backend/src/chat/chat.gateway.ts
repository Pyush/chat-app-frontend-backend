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

const options = {
  cors: {
    origin: '*',
  },
};
@WebSocketGateway(options)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  socketId: any[] = [];

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    this.socketId = [];
  }

  async handleConnection(client: any, ...args: any[]) {
    this.logger.debug(`${client.id} is connected...`);
    try {
      const decodedToken = await this.authService.verifyJwt(
        client.handshake.headers.authorization,
      );
      const user: User = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(client);
      } else {
        client.data.user = user;

        // Save connection
        this.socketId.push({ socketId: client.id, user });
        // Only emit online to the specific connected client
        for (let index = 0; index < this.socketId.length; index++) {
          const element = this.socketId[index];
          this.server.to(element.socketId).emit('online', user);
        }
        return 'success';
      }
    } catch {
      return this.disconnect(client);
    }
  }
  handleDisconnect(client: any) {
    this.logger.debug(`${client.id} is disconnected...`);
    const findIndex = this.socketId.findIndex(
      (obj) => obj.socketId === client.id,
    );
    if (findIndex !== -1) {
      const user = this.socketId[findIndex].user;
      for (let index = 0; index < this.socketId.length; index++) {
        const element = this.socketId[index];
        if (element.user._id !== user._id) {
          this.server.to(element.socketId).emit('offline', user);
        }
      }
      this.socketId.splice(findIndex, 1);
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
  }
}
