import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketServiceService } from './socket-service.service';
import { CallManager } from './call';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'test_call';

  callManager?: CallManager;

  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;

  constructor(private socketService: SocketServiceService) {}

  ngAfterViewInit() {
    // initialize call manager once video elements are available
    this.callManager = new CallManager(
      this.socketService,
      this.localVideoRef.nativeElement,
      this.remoteVideoRef.nativeElement,
    );
  }

  ngOnDestroy() {
    this.callManager?.leaveRoom();
    this.callManager?.hangup();
  }
}
