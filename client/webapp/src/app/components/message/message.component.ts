import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MessageTransmissionStatus } from '../../../types/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent {
  @Input() content!: string;
  @Input() sender!: string;
  @Input() isOwnMessage = false;
  @Input() status: MessageTransmissionStatus = MessageTransmissionStatus.SENT;
  @Input() attachments: Array<{ url: string; mediaType: string }> = [];
  @Input() type: string = 'text';
  @Input() pollId?: string;
  @Input() createdAt?: string;
  @Input() singleEmoji = false;
  @Input() currentUser: string = '';
  @Input() reactions: Array<{ emoji: string; user: string }> = [];

  showReactions = false;
  showReactionMenu = false;
  MessageTransmissionStatus = MessageTransmissionStatus;

  reactionsMap = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😆', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
  ];

  allEmojis = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😆', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '🤔', label: 'Thinking' },
    { emoji: '😍', label: 'Love Eyes' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '👏', label: 'Clap' },
    { emoji: '🎉', label: 'Party' },
    { emoji: '💯', label: 'Perfect' },
    { emoji: '✨', label: 'Sparkles' },
    { emoji: '😂', label: 'Laughing' },
    { emoji: '🤣', label: 'Rofl' },
    { emoji: '😎', label: 'Cool' },
  ];

  /** Groups reactions by emoji for display */
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
    // Remove current user's previous reaction (one reaction per user)
    this.reactions = this.reactions.filter((r) => r.user !== this.currentUser);
    // Add the new one
    this.reactions = [
      ...this.reactions,
      { emoji: reaction.emoji, user: this.currentUser },
    ];
  }

  toggleReactionMenu() {
    this.showReactionMenu = !this.showReactionMenu;
  }

  changeReaction(emoji: { emoji: string; label: string }) {
    this.showReactionMenu = false;
    // Remove current user's previous reaction
    this.reactions = this.reactions.filter((r) => r.user !== this.currentUser);
    // Add the new emoji
    this.reactions = [
      ...this.reactions,
      { emoji: emoji.emoji, user: this.currentUser },
    ];
  }
}
