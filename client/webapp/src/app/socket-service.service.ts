import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
// event names (same as server constants)
const CALL_OFFER = 'webrtc:offer';
const CALL_ANSWER = 'webrtc:answer';
const ICE_CANDIDATE = 'webrtc:ice_candidate';
const CALL_END = 'webrtc:call_end';

@Injectable({
  providedIn: 'root',
})
export class SocketServiceService {
  private socket: Socket;
  serverUrl = 'http://localhost:8080';

  constructor() {
    this.socket = io(this.serverUrl);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Handle cleanup
      return () => {
        this.socket.off(event);
      };
    });
  }

  // convenience wrappers for signaling events
  sendCallOffer(to: string | undefined, offer: any, room?: string) {
    this.emit(CALL_OFFER, { to, room, offer });
  }

  sendCallAnswer(to: string | undefined, answer: any, room?: string) {
    this.emit(CALL_ANSWER, { to, room, answer });
  }

  sendIceCandidate(to: string | undefined, candidate: any, room?: string) {
    this.emit(ICE_CANDIDATE, { to, room, candidate });
  }

  endCall(to?: string | undefined, room?: string) {
    this.emit(CALL_END, { to, room });
  }

  onCallOffer(): Observable<any> {
    return this.on(CALL_OFFER);
  }

  onCallAnswer(): Observable<any> {
    return this.on(CALL_ANSWER);
  }

  onIceCandidate(): Observable<any> {
    return this.on(ICE_CANDIDATE);
  }

  onCallEnd(): Observable<any> {
    return this.on(CALL_END);
  }
}
