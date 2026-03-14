import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MessageComponent } from '../components/message/message.component';
import { PollMessageComponent } from '../components/poll-message/poll-message.component';
import { MessageTransmissionStatus } from '../../types/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MessageComponent, PollMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewInit {
  messageGroupWidths: { [key: string]: number } = {};
  revealedMessages = new Set<string>();

  messages = [
    // DAY 1
    {
      type: 'text',
      content: 'Hello, how are you?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
    },
    {
      type: 'text',
      content: 'I am Alice btw',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 1).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
    },
    {
      type: 'text',
      content: 'Alice Green 😅',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 2).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
    },
    {
      type: 'text',
      content: '💸',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 2).toISOString(),
      status: MessageTransmissionStatus.SEEN,
    },
    {
      type: 'text',
      content: 'Hey Alice Hey Alice Hey Alice Hey Alice',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 5).toISOString(),
      status: MessageTransmissionStatus.SEEN,
    },
    {
      type: 'text',
      content: 'Doing good!',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 6).toISOString(),
      status: MessageTransmissionStatus.SENT,
    },

    {
      type: 'text',
      content: 'Nice to hear!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 8).toISOString(),
      status: MessageTransmissionStatus.DELIVERED,
    },

    // DAY 2
    {
      type: 'text',
      content: 'What are you doing today?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 2, 10, 0).toISOString(),
      status: MessageTransmissionStatus.SEEN,
    },

    {
      type: 'text',
      content: 'Working on the chat UI',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 2, 10, 3).toISOString(),
      status: MessageTransmissionStatus.SEEN,
    },

    {
      type: 'text',
      content: 'Looks great so far!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 2, 10, 5).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
    },

    // DAY 3 POLLS
    {
      type: 'poll',
      content: 'Vote to timeout user xyz',
      reason: 'Spam',
      status: MessageTransmissionStatus.DELIVERED,
      description: 'User xyz posted spam links',
      options: [
        { label: 'yes', votes: 1, selected: true },
        { label: 'no', votes: 0, selected: false },
      ],
      consequence: 'user xyz will be banned for 8 hours if majority accepts',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 3, 16, 0).toISOString(),
    },
    {
      type: 'poll',
      content: 'Kick inactive user?',
      reason: 'Inactive',
      status: MessageTransmissionStatus.SENT,
      description: 'User hasn’t talked in 3 months',
      options: [
        { label: 'yes', votes: 3, selected: false },
        { label: 'no', votes: 1, selected: true },
      ],
      consequence: 'User will be removed if vote passes',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 3, 16, 5).toISOString(),
    },
  ];

  groupedMessagesByDate: any[] = [];
  groupedMessagesBySenderAndDate: {
    [key: string]: { sender: string; messages: any[] }[];
  } = {};
  dates: string[] = [];

  constructor() {
    this.buildMessageGroups();
  }

  buildMessageGroups() {
    const dateGroups: { [key: string]: any[] } = {};

    for (const message of this.messages) {
      const dateKey = new Date(message.createdAt).toDateString();

      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = [];
      }

      dateGroups[dateKey].push(message);
    }

    this.groupedMessagesByDate = Object.entries(dateGroups).map(
      ([date, messages]) => ({
        date,
        messages,
      }),
    );

    const senderGroups: {
      [key: string]: { sender: string; messages: any[] }[];
    } = {};

    for (const day of this.groupedMessagesByDate) {
      const date = day.date;

      senderGroups[date] = [];

      let currentGroup: { sender: string; messages: any[] } | null = null;

      for (const message of day.messages) {
        if (!currentGroup || currentGroup.sender !== message.sender) {
          currentGroup = {
            sender: message.sender,
            messages: [],
          };

          senderGroups[date].push(currentGroup);
        }

        currentGroup.messages.push(message);
      }
    }

    this.groupedMessagesBySenderAndDate = senderGroups;
    this.dates = Object.keys(senderGroups);
  }

  senderGroupsFor(date: string) {
    return this.groupedMessagesBySenderAndDate[date] || [];
  }

  trackDate(index: number, date: string) {
    return date;
  }

  trackSender(index: number, group: any) {
    return group.sender;
  }

  trackMessage(index: number, message: any) {
    return message.createdAt + message.sender;
  }

  isSingleEmoji(content: string): boolean {
    try {
      const trimmed = content?.trim();

      const emojiRegex =
        /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;

      return emojiRegex.test(trimmed) && trimmed.length > 0;
    } catch {
      return false;
    }
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

  ngAfterViewInit() {
    setTimeout(() => this.calculateGroupWidths(), 0);
  }

  calculateGroupWidths() {
    this.messageGroupWidths = {};

    let messageIndex = 0;

    for (const date of this.dates) {
      const senderGroups = this.senderGroupsFor(date);

      for (const group of senderGroups) {
        const groupKey = `${date}-${group.sender}`;

        let maxWidth = 0;

        for (let i = 0; i < group.messages.length; i++) {
          const element = document.querySelector(
            `[data-message-index="${messageIndex}"]`,
          ) as HTMLElement;

          if (element) {
            maxWidth = Math.max(maxWidth, element.offsetWidth);
          }

          messageIndex++;
        }

        this.messageGroupWidths[groupKey] = maxWidth;
      }
    }
  }

  getMessageId(message: any, index: number, date: string): string {
    return `${date}-${message.sender}-${message.createdAt}-${index}`;
  }

  toggleOverlay(messageId: string) {
    if (this.revealedMessages.has(messageId)) {
      this.revealedMessages.delete(messageId);
    } else {
      this.revealedMessages.add(messageId);
    }
  }

  isMessageRevealed(messageId: string) {
    return this.revealedMessages.has(messageId);
  }

  shouldApplyLastMessage(messages: any[], index: number): boolean {
    const isLast = index === messages.length - 1;

    if (messages[index].type !== 'text') return false;

    const isSingleEmoji = this.isSingleEmoji(messages[index].content);

    if (isLast && isSingleEmoji) return false;

    if (isLast && !isSingleEmoji) return true;

    if (index === messages.length - 2) {
      const nextMessage = messages[index + 1];

      if (this.isSingleEmoji(nextMessage.content)) {
        return true;
      }
    }

    return false;
  }
}
