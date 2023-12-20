import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends Socket {
  constructor() {
    const data = JSON.parse(localStorage.getItem('user') || '');
    const config: SocketIoConfig = {
      url: 'http://localhost:3000/',
      options: {
        path: '/chat',
        query: {
          token: data.refreshToken,
          deviceType: 'WEB',
        },
      },
    };
    super(config);
  }

  sendMessage(messageData: any) {
    this.emit('messageSend', messageData);
  }

  public getMessages() {
    return new Observable((observer) => {
      this.on('messageReceive', (message: any) => {
        console.log('messageReceive', message);
        observer.next(message);
      });
    });
  }
}
