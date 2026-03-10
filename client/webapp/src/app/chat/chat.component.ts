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
    {
      content: 'Hello, how are you?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      content: 'I am good, thanks! How about you?',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 15).toISOString(),
    },
    {
      content: 'I am doing well too!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 30).toISOString(),
    },
    {
      content: 'Great! See you later.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 10, 0).toISOString(),
    },
    {
      content: 'Bye!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 10, 15).toISOString(),
    },
    {
      content: 'Hi again!',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 2, 8, 0).toISOString(),
    },
    {
      content: "Hey! What's up?",
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 2, 8, 20).toISOString(),
    },
    {
      content: 'Nothing much, just working.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 2, 8, 40).toISOString(),
    },
    {
      content: 'Same here!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 2, 9, 0).toISOString(),
    },
    {
      content: 'Talk later?',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 2, 9, 30).toISOString(),
    },
    {
      content: 'Sure!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 10, 0).toISOString(),
    },
    {
      content: "How's your day?",
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 3, 10, 15).toISOString(),
    },
    {
      content: 'Pretty good!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 10, 35).toISOString(),
    },
    {
      content: 'Glad to hear that.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 3, 11, 0).toISOString(),
    },
    {
      content: 'Thanks!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 11, 20).toISOString(),
    },
    {
      content: 'Long time no talk!',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 14, 0).toISOString(),
    },
    {
      content: 'Indeed! How have you been?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 4, 14, 25).toISOString(),
    },
    {
      content: 'Busy with projects.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 14, 45).toISOString(),
    },
    {
      content: 'I understand.',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 4, 15, 10).toISOString(),
    },
    {
      content: "Let's catch up soon!",
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 15, 30).toISOString(),
    },
  ];

  get groupedMessages() {
    const groups: { [key: string]: any[] } = {};
    this.messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  }
}
