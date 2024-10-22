# rtc-communication-server

rtc-communication-server is a chat and media server built in nodejs which is a part of a microservices like architecture

The communication server is a backend service built using Fastify. It handles WebSockets connections for the chat service.

## Overview

The communication server is a backend service built using Fastify. It handles WebSockets Connections Of chat service

## Prerequisites

-   Node.js
-   npm or yarn
-   MongoDB Server
-   Redis Server

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/elhoussineazerhoune/Clarity-Fiber.git
```

### 2. Navigate to the Directory

Navigate to the directory where you cloned the repository:

```bash
cd Clarity-Fiber/backend/communication-server
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

The communication server establishes a WebSocket connection at the `/ws` endpoint.
