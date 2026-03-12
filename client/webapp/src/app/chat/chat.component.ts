import {
  Component,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { MessageComponent } from '../components/message/message.component';
import { CommonModule } from '@angular/common';
import { PollMessageComponent } from '../components/poll-message/poll-message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent, PollMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements AfterViewInit {
  @ViewChildren('messageBox') messageBoxes!: QueryList<any>;
  messageGroupWidths: { [key: string]: number } = {};
  revealedMessages = new Set<string>();
  messages = [
    {
      type: 'text',
      content: 'Hello, how are you?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      type: 'text',
      content: 'I am Alice btw',
      sender: 'Alice',
      isOwnMessage: false,
      isSeen: true,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      type: 'text',
      content: 'Alice Green',
      sender: 'Alice',
      isOwnMessage: false,
      isSeen: true,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      type: 'text',
      content: '😅',
      sender: 'Alice',
      isOwnMessage: false,
      isSeen: true,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      type: 'text',
      content:
        'I am good, thanks! How about you? I am good, thanks! How about you I am good, thanks! How about you I am good, thanks! How about you I am good, thanks! How about you',
      isSeen: true,
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 15).toISOString(),
    },
    {
      type: 'text',
      content: 'I am good, thanks! How about you?',
      isSeen: true,
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 15).toISOString(),
    },
    {
      type: 'text',
      content: '😍',
      isSeen: true,
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
    },
    {
      type: 'text',
      content: "How's your day?",
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 3, 10, 15).toISOString(),
    },
    {
      type: 'text',
      content: 'Pretty good!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 10, 35).toISOString(),
    },
    {
      type: 'text',
      content: 'Glad to hear that.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 3, 11, 0).toISOString(),
    },
    {
      type: 'text',
      content: 'Thanks!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 11, 20).toISOString(),
    },
    {
      type: 'text',
      content: 'Long time no talk!',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 14, 0).toISOString(),
    },
    {
      type: 'text',
      content: 'Indeed! How have you been?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 4, 14, 25).toISOString(),
    },
    {
      type: 'text',
      content: 'Busy with projects.',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 14, 45).toISOString(),
    },
    {
      type: 'text',
      content: 'I understand.',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 4, 15, 10).toISOString(),
    },
    {
      type: 'text',
      content: "Let's catch up soon!",
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 4, 15, 30).toISOString(),
    },
    {
      type: 'poll',
      title: 'user abc raised a poll to timout user xyz for 8 4 hours',
      reason: 'raison',
      description: 'user xyz did efg',
      options: [
        { label: 'yes', votes: 1, selected: true },
        { label: 'no', votes: 0, selected: false },
      ],
      consequence:
        'user xyz will be banned for 8 hours if more than 50% of chat accepted',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 4, 16, 0).toISOString(),
    },
  ];

  get groupedMessagesByDate() {
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

  get groupedMessagesBySenderAndDate() {
    const groups: { [key: string]: { sender: string; messages: any[] }[] } = {};
    const messages = this.groupedMessagesByDate;

    for (let date in messages) {
      groups[date] = [];
      let currentGroup: { sender: string; messages: any[] } | null = null;

      messages[date].messages.forEach((message: any) => {
        if (!currentGroup || currentGroup.sender !== message.sender) {
          currentGroup = { sender: message.sender, messages: [] };
          groups[date].push(currentGroup);
        }
        currentGroup.messages.push(message);
      });
    }
    return groups;
  }

  // helpers for template iteration
  get dates(): string[] {
    return Object.keys(this.groupedMessagesBySenderAndDate);
  }

  senderGroupsFor(date: string): { sender: string; messages: any[] }[] {
    const group = this.groupedMessagesBySenderAndDate[date];
    return group || [];
  }

  isSingleEmoji(content: string): boolean {
    const trimmed = content.trim();
    // Basic emoji regex for common emojis
    const emojiRegex =
      /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;

    console.log(
      'Checking if content is a single emoji:',
      content,
      'Trimmed:',
      trimmed,
      'Is single emoji:',
      emojiRegex.test(trimmed) && trimmed.length > 0,
    );
    return emojiRegex.test(trimmed) && trimmed.length > 0;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.calculateGroupWidths(), 0);
  }

  calculateGroupWidths(): void {
    this.messageGroupWidths = {};
    const dates = this.dates;
    let messageIndex = 0;

    dates.forEach((date) => {
      const senderGroups = this.senderGroupsFor(date);
      senderGroups.forEach((group) => {
        const groupKey = `${date}-${group.sender}`;
        let maxWidth = 0;

        group.messages.forEach(() => {
          const element = document.querySelector(
            `[data-message-index="${messageIndex}"]`,
          ) as HTMLElement;
          if (element) {
            const width = element.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
          }
          messageIndex++;
        });

        this.messageGroupWidths[groupKey] = maxWidth;
        messageIndex -= group.messages.length;
        group.messages.forEach((_, i) => {
          const element = document.querySelector(
            `[data-message-index="${messageIndex + i}"]`,
          ) as HTMLElement;
          if (element) {
            element.style.width = maxWidth + 'px';
          }
        });
        messageIndex += group.messages.length;
      });
    });
  }

  getGroupKey(date: string, sender: string): string {
    return `${date}-${sender}`;
  }

  getMessageId(message: any, index: number, date: string): string {
    return `${date}-${message.sender}-${message.createdAt}-${index}`;
  }

  toggleOverlay(messageId: string): void {
    if (this.revealedMessages.has(messageId)) {
      this.revealedMessages.delete(messageId);
    } else {
      this.revealedMessages.add(messageId);
    }
  }

  isMessageRevealed(messageId: string): boolean {
    return this.revealedMessages.has(messageId);
  }

  shouldApplyLastMessage(messages: any[], index: number): boolean {
    const isLast = index === messages.length - 1;
    const isSingleEmoji = this.isSingleEmoji(messages[index].content);

    // Don't apply 'last-message' to a single emoji that is the last message
    if (isLast && isSingleEmoji) {
      return false;
    }

    // Apply 'last-message' to the actual last message if it's not a single emoji
    if (isLast && !isSingleEmoji) {
      return true;
    }

    // Check if the next message is last and is a single emoji
    // If so, apply 'last-message' to the current message
    if (index === messages.length - 2) {
      const nextMessage = messages[index + 1];
      if (this.isSingleEmoji(nextMessage.content)) {
        return true;
      }
    }

    return false;
  }
}
