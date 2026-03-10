# rtc-communication-server

rtc-communication-server is a chat and media server built in nodejs which is a part of a microservices like architecture

The communication server is a backend service built using Fastify. It handles WebSockets connections for the chat service.

## Overview

The communication server is a backend service built using Fastify. It handles WebSockets Connections Of chat service

## Prerequisites

- Node.js
- npm or yarn
- MongoDB Server
- Redis Server
- Angular CLI (globally installed) if you want to run the test Angular client

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Dabaghi-Anass/rtc-communication-server.git
```

### 2. Navigate to the Directory

Navigate to the directory where you cloned the repository:

```bash
cd rtc-communication-server
```

### 3. Install Dependencies

Install the dependencies using npm or yarn:

```bash
npm install
```

### 4. Create a .env File

Create a `.env` file in the root of the project and add the following environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/communication-server
REDIS_URI=redis://localhost:6379
```

### 5. Start the Server

Start the server using npm or yarn:

```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

The communication server has the following API endpoints:

### 1. WebSocket Connection

The communication server establishes a WebSocket connection at the `/` endpoint. All real-time interactions are handled via **socket.io** events.

## Test Angular Client

A minimal Angular application lives in `client/test_call`. It demonstrates room management, one‑to‑one and room‑based calls via WebRTC.

To run the client:

```bash
cd client/test_call
npm install
npm start
```

The app will open in your browser. Enter a room name and hit **Join Room** on two separate browser windows (or machines). Use **Call Room** to initiate a peer‑to‑peer call. Use **Hang Up** to end the call.

#### Room Management

- `chat:join_room` – join a named room
- `chat:leave_room` – leave a room

Room names can be any string; once joined, messages and call signaling can be broadcast to the room.

#### Chat Events

- `chat:private_message` – send a message to other connected users (always broadcast)
- `chat:typing` / `chat:typing_stop` – typing indicators
- `chat:user_online` / `chat:user_offline` – presence notifications

#### WebRTC Call Signaling

To enable peer‑to‑peer audio/video calls the server simply forwards signaling messages between clients. Use the following events:

- `webrtc:offer` – send an SDP offer. Payload: `{ to?: socketId, room?: roomName, offer }`.
- `webrtc:answer` – send an SDP answer. Payload: `{ to?: socketId, room?: roomName, answer }`.
- `webrtc:ice_candidate` – exchange ICE candidates. Payload: `{ to?: socketId, room?: roomName, candidate }`.
- `webrtc:call_end` – notify peers that the call has ended. Payload: `{ to?: socketId, room?: roomName }`.

The `to` property targets a specific socket; `room` broadcasts to all other members of the room.

Clients are responsible for creating RTCPeerConnection objects and handling the actual media streams; the server only relays the signaling data.
