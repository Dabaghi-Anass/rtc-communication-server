import { Server } from 'socket.io';
import { getPubSubClients } from '../connections/pub-sub';
import { RedisChannels } from '../constants/redis-channels';
import { IoChatEvent } from '../constants/socketio';
import { getLogger } from '../utils/logger';
function publishDisconnectEvent(socket, publisher) {
  socket.broadcast.emit(IoChatEvent.USER_OFFLINE, 'user left');
  publisher.publish(
    RedisChannels.USER_OFFLINE_CHANNEL,
    JSON.stringify({ status: 'offline' }),
  );
}
export async function handleSocketConnections(io: Server): Promise<void> {
  //pub client to publish messages to redis
  const { pubClient, subClient } = await getPubSubClients();
  const logger = await getLogger();
  logger.success('Socket.io server started');

  //subscribe to messages channel
  subClient.subscribe(
    RedisChannels.MESSAGE_CREATED_CHANNEL,
    (message, channel) => {
      if (message) {
        logger.warn(
          `reseived message from channel: ${channel}`,
          JSON.parse(message),
        );
      }
    },
  );

  //subscribe to user offline channel
  subClient.subscribe(
    RedisChannels.USER_OFFLINE_CHANNEL,
    (message, channel) => {
      if (message) {
        logger.warn(
          `reseived message from channel: ${channel}`,
          JSON.parse(message),
        );
      }
    },
  );

  io.on('connection', (socket) => {
    logger.info('Client connected', socket.id);

    //join room event
    socket.on(IoChatEvent.JOIN_ROOM, (room) => {
      logger.info(`User joined room: ${room}`);
      socket.join(room);
    });

    //leave room event
    socket.on(IoChatEvent.LEAVE_ROOM, (room) => {
      logger.info(`User left room: ${room}`);
      socket.leave(room);
    });

    //message event
    socket.on(IoChatEvent.MESSAGE, (data) => {
      logger.info('Message received: ', data);
      pubClient.publish(
        RedisChannels.MESSAGE_CREATED_CHANNEL,
        JSON.stringify(data),
      );
      socket.broadcast.emit(IoChatEvent.MESSAGE, data);
    });

    //typing event
    socket.on(IoChatEvent.TYPING, (data) => {
      logger.info('Typing event received: ', data);
      socket.broadcast.emit(IoChatEvent.TYPING, data);
    });

    // typing stop event
    socket.on(IoChatEvent.TYPING_STOP, (data) => {
      logger.info('Typing stop event received: ', data);
      socket.broadcast.emit(IoChatEvent.TYPING_STOP, data);
    });

    // --- WebRTC signaling ---
    // forward call offers to a specific socket or room
    socket.on(IoChatEvent.CALL_OFFER, (payload) => {
      logger.info('Call offer received', payload);
      const { to, room, offer } = payload as any;
      if (room) {
        // broadcast to everyone in room except sender
        socket
          .to(room)
          .emit(IoChatEvent.CALL_OFFER, { from: socket.id, offer });
      } else if (to) {
        socket.to(to).emit(IoChatEvent.CALL_OFFER, { from: socket.id, offer });
      }
    });

    // forward answers
    socket.on(IoChatEvent.CALL_ANSWER, (payload) => {
      logger.info('Call answer received', payload);
      const { to, room, answer } = payload as any;
      if (room) {
        socket
          .to(room)
          .emit(IoChatEvent.CALL_ANSWER, { from: socket.id, answer });
      } else if (to) {
        socket
          .to(to)
          .emit(IoChatEvent.CALL_ANSWER, { from: socket.id, answer });
      }
    });

    // ice candidate exchange
    socket.on(IoChatEvent.ICE_CANDIDATE, (payload) => {
      logger.info('ICE candidate', payload);
      const { to, room, candidate } = payload as any;
      if (room) {
        socket
          .to(room)
          .emit(IoChatEvent.ICE_CANDIDATE, { from: socket.id, candidate });
      } else if (to) {
        socket
          .to(to)
          .emit(IoChatEvent.ICE_CANDIDATE, { from: socket.id, candidate });
      }
    });

    // end call
    socket.on(IoChatEvent.CALL_END, (payload) => {
      logger.info('Call end', payload);
      const { to, room } = payload as any;
      if (room) {
        socket.to(room).emit(IoChatEvent.CALL_END, { from: socket.id });
      } else if (to) {
        socket.to(to).emit(IoChatEvent.CALL_END, { from: socket.id });
      }
    });

    //disconnect event
    socket.on('disconnect', () => publishDisconnectEvent(socket, pubClient));
  });
}
