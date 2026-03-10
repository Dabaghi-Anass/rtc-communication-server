import { Component } from '@angular/core';
import { MessageComponent } from '../components/message/message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  messages = [
    { text: 'Hello, how are you?', sender: 'Alice', isOwnMessage: false },
    {
      text: 'I am good, thanks! How about you?',
      sender: 'Bob',
      isOwnMessage: true,
    },
    {
      text: 'I am doing well too!',
      sender: 'Alice',
      isOwnMessage: false,
    },
  ];
}
