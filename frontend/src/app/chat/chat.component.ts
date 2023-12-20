import { Component, OnInit } from '@angular/core';
import { ChatService } from '../utilities/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  
  chatList: any[] = [];
  message!: string;
  onlineOffline: string = 'Online';
  constructor(private chatService: ChatService) { 

  }

  ngOnInit(): void {
    this.chatService.getMessages().subscribe((message: any) => {
      this.chatList.push(message);
    });

    this.chatService.getOnline().subscribe((data: any) => {
      console.log('online', data);
      const toEmail = localStorage.getItem('to');
      if (data.email === toEmail) {
        this.onlineOffline = 'Online';
      }
    });

    this.chatService.getOffline().subscribe((data: any) => {
      console.log('offline', data);
      const toEmail = localStorage.getItem('to');
      if (data.email === toEmail) {
        this.onlineOffline = 'Offline';
      }
    });
  }

  getToUserName() {
    const toName = localStorage.getItem('toname');
    return toName;
  }
  sendMessage() {
    const toEmail = localStorage.getItem('to');
    const fromEmail = localStorage.getItem('userEmail');
    const messageData = {
      from: fromEmail,
      to: toEmail,
      message: this.message,
    }
    this.chatService.sendMessage(messageData);
    this.chatList.push(messageData);
    this.message = '';
  }

  checkFromUser(data: any) {
    const fromEmail = localStorage.getItem('userEmail');
    return fromEmail === data.from ? true : false;
  }

}
