import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTransmissionStatus } from '../../../types/message';

@Component({
  selector: 'app-poll-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll-message.component.html',
  styleUrl: './poll-message.component.css',
})
export class PollMessageComponent {
  @Input() content!: string;
  @Input() reason!: string;
  @Input() description!: string;
  @Input() consequence!: string;
  @Input() options: any[] = [];
  @Input() createdAt!: string;
  @Input() sender!: string;
  @Input() isOwnMessage = false;
  @Input() status: MessageTransmissionStatus = MessageTransmissionStatus.SENT;
  @Input() currentUser: string = '';
  @Input() reactions: Array<{ emoji: string; user: string }> = [];

  showReactions = false;
  MessageTransmissionStatus = MessageTransmissionStatus;

  reactionsMap = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😆', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
  ];

  get groupedReactions(): Array<{ emoji: string; count: number }> {
    const map = new Map<string, number>();
    for (const r of this.reactions) {
      map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([emoji, count]) => ({
      emoji,
      count,
    }));
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toggleReactions() {
    this.showReactions = !this.showReactions;
  }

  addReaction(reaction: { emoji: string; label: string }) {
    this.showReactions = false;
    this.reactions = this.reactions.filter((r) => r.user !== this.currentUser);
    this.reactions = [
      ...this.reactions,
      { emoji: reaction.emoji, user: this.currentUser },
    ];
  }
}
