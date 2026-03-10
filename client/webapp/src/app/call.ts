import { SocketServiceService } from './socket-service.service';

/**
 * Encapsulates all WebRTC/call related state and logic. The Angular component
 * simply holds a reference to this class and delegates to it.
 */
export class CallManager {
  room = '';
  inRoom = false;
  inCall = false;

  private localStream: MediaStream | null = null;
  private pc: RTCPeerConnection | null = null;

  constructor(
    private socketService: SocketServiceService,
    private localVideoEl: HTMLVideoElement,
    private remoteVideoEl: HTMLVideoElement,
  ) {
    this.setupSocketListeners();
    this.openLocalStream();
  }

  private async openLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localVideoEl.srcObject = this.localStream;
      this.localVideoEl.muted = true;
    } catch (err) {
      console.error('Failed to access media devices', err);
    }
  }

  private setupSocketListeners() {
    this.socketService
      .onCallOffer()
      .subscribe(async ({ from, offer, room }) => {
        if (!this.pc) this.createPeerConnection();
        if (this.pc) {
          await this.pc.setRemoteDescription(offer);
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);
          this.socketService.sendCallAnswer(from, answer, room);
          this.inCall = true;
        }
      });

    this.socketService.onCallAnswer().subscribe(async ({ answer }) => {
      if (this.pc) {
        await this.pc.setRemoteDescription(answer);
      }
    });

    this.socketService.onIceCandidate().subscribe(async ({ candidate }) => {
      if (this.pc && candidate) {
        try {
          await this.pc.addIceCandidate(candidate);
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    this.socketService.onCallEnd().subscribe(() => {
      this.hangup();
    });
  }

  private createPeerConnection() {
    this.pc = new RTCPeerConnection();
    if (this.localStream) {
      for (const track of this.localStream.getTracks()) {
        this.pc.addTrack(track, this.localStream);
      }
    }
    this.pc.ontrack = (event) => {
      this.remoteVideoEl.srcObject = event.streams[0];
    };
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socketService.sendIceCandidate(undefined, e.candidate, this.room);
      }
    };
    this.pc.onconnectionstatechange = () => {
      if (
        this.pc?.connectionState === 'disconnected' ||
        this.pc?.connectionState === 'failed'
      ) {
        this.hangup();
      }
    };
  }

  joinRoom() {
    if (this.room.trim()) {
      this.socketService.emit('chat:join_room', this.room);
      this.inRoom = true;
    }
  }

  leaveRoom() {
    if (this.inRoom) {
      this.socketService.emit('chat:leave_room', this.room);
      this.inRoom = false;
    }
  }

  async startCall() {
    if (!this.room || !this.localStream) return;
    if (!this.pc) this.createPeerConnection();
    if (!this.pc) return;

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.socketService.sendCallOffer(undefined, offer, this.room);
    this.inCall = true;
  }

  hangup() {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.inCall) {
      this.socketService.endCall(undefined, this.room);
    }
    this.inCall = false;
  }
}
