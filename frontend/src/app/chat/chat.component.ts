import { ChatService } from './../../../../backend/src/chat/chat.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(private chatService: ChatService) { }

}
