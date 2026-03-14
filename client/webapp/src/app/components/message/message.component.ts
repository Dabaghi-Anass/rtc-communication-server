import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MessageTransmissionStatus } from '../../../types/message';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  // flag to indicate message is just a single emoji (used for styling)
  MessageTransmissionStatus = MessageTransmissionStatus;
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
