import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  @Input() content!: string;
  @Input() sender!: string;
  @Input() isOwnMessage = false;
  @Input() attachments: Array<{ url: string; mediaType: string }> = [];
  @Input() type: string = 'text';
  @Input() pollId?: string;
  @Input() createdAt?: string;

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
