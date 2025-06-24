import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketServiceService } from './socket-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test_call';
  videoSrcObject: MediaStream | null = null;
  socketIoSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';

  //create a function to display user camera on the video element
  async startVideo() {
    try {
      this.videoSrcObject = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } catch (error) {
      console.error('Error opening video camera.', error);
    }
  }
  //instanciate a video call
  connectToServer() {
    this.socketService.emit('join', 'test');
  }
  constructor(private socketService: SocketServiceService) {
    this.startVideo();
    this.socketIoSubscription = this.socketService
      .on('message')
      .subscribe((data) => {
        // this.messages.push(data.text);
      });
  }
  ngOnDestroy() {
    this.socketIoSubscription.unsubscribe();
  }
}
