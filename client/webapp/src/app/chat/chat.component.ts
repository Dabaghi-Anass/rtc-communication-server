import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../components/message/message.component';
import { PollMessageComponent } from '../components/poll-message/poll-message.component';
import { MessageTransmissionStatus } from '../../types/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent, PollMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewInit {
  messageGroupWidths: { [key: string]: number } = {};
  revealedMessages = new Set<string>();

  currentUser = 'Bob';

  // Message and Audio Input
  messageInput = '';
  isRecording = false;
  recordingTime = 0;
  recordingTimer: any = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  sentMessages: { type: string; content: string; timestamp: Date }[] = [];

  // Audio visualization
  audioContexts: { [key: string]: AudioContext } = {};
  analysers: { [key: string]: AnalyserNode } = {};
  animationFrames: { [key: string]: number } = {};
  audioElements: { [key: string]: HTMLAudioElement } = {};

  messages = [
    // DAY 1
    {
      type: 'text',
      content: 'Hello, how are you?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
      reactions: [{ emoji: '😁', user: 'Alice' }],
    },
    {
      type: 'text',
      content: 'I am Alice btw',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 1).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
      reactions: [{ emoji: '❤️', user: 'Alice' }],
    },
    {
      type: 'text',
      content: 'Alice Green 😅',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 2).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
      reactions: [{ emoji: '❤️', user: 'Charlie' }],
    },
    {
      type: 'text',
      content: '💸',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 2).toISOString(),
      status: MessageTransmissionStatus.SEEN,
      reactions: [],
    },
    {
      type: 'text',
      content: 'Hey Alice Hey Alice Hey Alice Hey Alice',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 5).toISOString(),
      status: MessageTransmissionStatus.SEEN,
      reactions: [{ emoji: '🚨', user: 'Dave' }],
    },
    {
      type: 'text',
      content: 'Doing good!',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 1, 9, 6).toISOString(),
      status: MessageTransmissionStatus.SENT,
      reactions: [],
    },
    {
      type: 'text',
      content: 'Nice to hear!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 1, 9, 8).toISOString(),
      status: MessageTransmissionStatus.DELIVERED,
      reactions: [],
    },

    // DAY 2
    {
      type: 'text',
      content: 'What are you doing today?',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2024, 0, 2, 10, 0).toISOString(),
      status: MessageTransmissionStatus.SEEN,
      reactions: [],
    },
    {
      type: 'text',
      content: 'Working on the chat UI',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2024, 0, 2, 10, 3).toISOString(),
      status: MessageTransmissionStatus.SEEN,
      reactions: [
        { emoji: '😎', user: 'Alice' },
        { emoji: '😎', user: 'Charlie' },
        { emoji: '😎', user: 'Dave' },
        { emoji: '😎', user: 'Eve' },
        { emoji: '😎', user: 'Frank' },
      ],
    },
    {
      type: 'text',
      content: 'Looks great so far!',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2026, 2, 13, 10, 5).toISOString(),
      status: MessageTransmissionStatus.TAKE_OFF,
      reactions: [],
    },

    // DAY 3 POLLS
    {
      type: 'poll',
      content: 'Vote to timeout user xyz',
      reason: 'Spam',
      status: MessageTransmissionStatus.SEEN,
      description: 'User xyz posted spam links',
      options: [
        { label: 'yes', votes: 1, selected: true },
        { label: 'no', votes: 0, selected: false },
      ],
      consequence: 'user xyz will be banned for 8 hours if majority accepts',
      sender: 'Alice',
      isOwnMessage: false,
      createdAt: new Date(2026, 2, 14, 16, 5).toISOString(),
      reactions: [],
    },
    {
      type: 'poll',
      content: 'Kick inactive user?',
      reason: 'Inactive',
      status: MessageTransmissionStatus.SENT,
      description: "User hasn't talked in 3 months",
      options: [
        { label: 'yes', votes: 3, selected: false },
        { label: 'no', votes: 1, selected: true },
      ],
      consequence: 'User will be removed if vote passes',
      sender: 'Bob',
      isOwnMessage: true,
      createdAt: new Date(2026, 2, 16, 7, 5).toISOString(),
      reactions: [],
    },
  ];

  groupedMessagesByDate: any[] = [];
  groupedMessagesBySenderAndDate: {
    [key: string]: { sender: string; messages: any[] }[];
  } = {};
  dates: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.buildMessageGroups();
  }

  buildMessageGroups() {
    const dateGroups: { [key: string]: any[] } = {};

    for (const message of this.messages) {
      const messageSentDate = new Date(message.createdAt);
      const today = new Date();
      let dateKey = new Date(message.createdAt).toDateString();

      const timeDiff = today.getTime() - messageSentDate.getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (timeDiff < oneDay) {
        dateKey = 'Today';
      } else if (timeDiff < 2 * oneDay) {
        dateKey = 'Yesterday';
      } else if (timeDiff < 7 * oneDay) {
        const dayName = messageSentDate.toLocaleDateString(undefined, {
          weekday: 'long',
        });
        dateKey = `${dayName}`;
      }

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
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
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
    const hasReactions = (messages[index].reactions?.length ?? 0) > 0;

    if (hasReactions) return false;

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

  sendMessage() {
    if (this.messageInput.trim()) {
      const newMessage = {
        type: 'text',
        content: this.messageInput,
        sender: this.currentUser,
        isOwnMessage: true,
        createdAt: new Date().toISOString(),
        status: MessageTransmissionStatus.SENT,
        reactions: [],
      };
      this.messages.push(newMessage);
      this.sentMessages.push({
        type: 'text',
        content: this.messageInput,
        timestamp: new Date(),
      });
      console.log('Message sent:', newMessage);
      this.messageInput = '';
      this.buildMessageGroups();
      this.cdr.markForCheck();
    }
  }

  async toggleAudioRecording() {
    if (this.isRecording) {
      this.stopAudioRecording();
    } else {
      await this.startAudioRecording();
    }
  }

  async startAudioRecording() {
    try {
      console.log('Starting audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.recordingTime = 0;

      // Set recording state immediately
      this.isRecording = true;
      this.cdr.markForCheck();
      console.log('Recording started');

      // Start recording timer
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
        this.cdr.markForCheck();
      }, 1000);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        console.log('Recording stopped');
        clearInterval(this.recordingTimer);

        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioMessage = {
            type: 'audio',
            content: audioUrl,
            sender: this.currentUser,
            isOwnMessage: true,
            createdAt: new Date().toISOString(),
            status: MessageTransmissionStatus.SENT,
            reactions: [],
            duration: this.recordingTime,
          };
          this.messages.push(audioMessage);
          this.sentMessages.push({
            type: 'audio',
            content: audioUrl,
            timestamp: new Date(),
          });
          console.log('Audio message pushed:', audioMessage);
          this.buildMessageGroups();
        }

        this.isRecording = false;
        this.audioChunks = [];
        this.recordingTime = 0;
        this.cdr.markForCheck();
      };

      this.mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        this.isRecording = false;
        this.recordingTime = 0;
        clearInterval(this.recordingTimer);
        this.cdr.markForCheck();
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.isRecording = false;
      this.recordingTime = 0;
      this.cdr.markForCheck();
      alert(
        'Microphone access denied. Please allow microphone access in your browser settings.',
      );
    }
  }

  stopAudioRecording() {
    console.log('Stopping audio recording...');
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      // Stop all tracks
      this.mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop();
        console.log('Track stopped');
      });
      this.isRecording = false;
      clearInterval(this.recordingTimer);
      this.cdr.markForCheck();
    }
  }

  toggleAudioPlayback(event: any) {
    const playBtn = event.currentTarget;
    const audioContainer = playBtn.closest('.audio-message');
    const audioElement = audioContainer.querySelector(
      'audio',
    ) as HTMLAudioElement;
    const canvas = audioContainer.querySelector(
      '.frequency-visualizer',
    ) as HTMLCanvasElement;
    const icon = playBtn.querySelector('.material-icons');
    const audioId = canvas?.getAttribute('data-audio-id') || 'default';

    if (!audioElement || !icon) return;

    if (audioElement.paused) {
      audioElement.play();
      icon.textContent = 'pause';

      // Initialize audio visualization
      if (!this.audioContexts[audioId]) {
        this.initAudioVisualization(audioElement, canvas, audioId);
      }

      // Add ended event listener to reset icon when audio naturally finishes
      audioElement.onended = () => {
        icon.textContent = 'play_arrow';
        if (this.animationFrames[audioId]) {
          cancelAnimationFrame(this.animationFrames[audioId]);
        }
      };

      // Start animation
      this.animateFrequencies(canvas, audioId);
    } else {
      audioElement.pause();
      icon.textContent = 'play_arrow';

      // Cancel animation
      if (this.animationFrames[audioId]) {
        cancelAnimationFrame(this.animationFrames[audioId]);
      }
    }
  }

  initAudioVisualization(
    audioElement: HTMLAudioElement,
    canvas: HTMLCanvasElement,
    audioId: string,
  ) {
    const AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementAudioSource(audioElement);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    this.audioContexts[audioId] = audioContext;
    this.analysers[audioId] = analyser;
    this.audioElements[audioId] = audioElement;

    // Set canvas size with proper scaling
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    // Scale canvas drawing context
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx) {
      canvasCtx.scale(scale, scale);
    }
  }

  animateFrequencies(canvas: HTMLCanvasElement, audioId: string) {
    const analyser = this.analysers[audioId];
    const audioElement = this.audioElements[audioId];

    if (!analyser || !audioElement) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) return;

    // Account for devicePixelRatio scaling
    const scale = window.devicePixelRatio;

    const draw = () => {
      if (audioElement.paused) return;

      this.animationFrames[audioId] = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with dark background
      canvasCtx.fillStyle = 'rgba(240, 240, 240, 0.1)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.width / bufferLength) * 4; // Sample every 4th bar
      let x = 0;

      // Select frequencies to display (sample every 4th bar for cleaner look)
      for (let i = 0; i < bufferLength; i += 4) {
        const barHeight = (dataArray[i] / 255) * (canvas.height * 0.9);

        // Create gradient for each bar
        const barGradient = canvasCtx.createLinearGradient(
          0,
          canvas.height,
          0,
          canvas.height - barHeight,
        );
        barGradient.addColorStop(0, '#0095f6');
        barGradient.addColorStop(0.5, '#1e90ff');
        barGradient.addColorStop(1, '#0073cc');

        canvasCtx.fillStyle = barGradient;
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight,
          Math.max(barWidth * 0.8, 1),
          Math.max(barHeight, 1),
        );

        // Add glow effect
        canvasCtx.shadowColor = 'rgba(0, 149, 246, 0.6)';
        canvasCtx.shadowBlur = 8;
        canvasCtx.shadowOffsetX = 0;
        canvasCtx.shadowOffsetY = 0;

        x += barWidth;
      }

      canvasCtx.shadowColor = 'transparent';
    };

    draw();
  }
}
