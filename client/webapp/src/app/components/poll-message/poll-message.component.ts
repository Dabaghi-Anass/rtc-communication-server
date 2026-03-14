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
  @Input() isSeen = false;
  @Input() status: MessageTransmissionStatus = MessageTransmissionStatus.SENT;

  getStatusEmoji(): string {
    switch (this.status) {
      case MessageTransmissionStatus.TAKE_OFF:
        return '🚀';

      case MessageTransmissionStatus.SENT:
        return '📨';

      case MessageTransmissionStatus.DELIVERED:
        return '📬';

      case MessageTransmissionStatus.SEEN:
        return '👀';

      default:
        return '';
    }
  }
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
