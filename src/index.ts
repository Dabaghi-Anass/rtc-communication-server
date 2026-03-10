import fastifyCors from '@fastify/cors';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import { Server } from 'socket.io';
import { connectDatabase } from './connections/mongodb';
import { handleSocketConnections } from './controllers/websocket.io';
import { MessageModel } from './models/message';
import { getLogger } from './utils/logger';
import { AttachmentMediaType, MessageType } from './types/chat';
import { ActionAfterExpiration } from './types/utils';
import { runInTransaction } from './utils/utils';
import { PollModel } from './models/poll-message';
dotenv.config();

const port: number = parseInt(process.env.PORT || '3000');

// const cachingService: ICachingService = new CachingService();

const app = Fastify();

app.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN,
});

const io = new Server(app.server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

handleSocketConnections(io);
connectDatabase();

// Define API routes under /api prefix
async function registerApiRoutes(fastify: any) {
  fastify.get('/create-message', async (request, reply) => {
    const message = new MessageModel({
      content: 'Hello world',
      sender: 'system',
      destination: 'system',
      type: MessageType.TEXT,
      attachements: [
        {
          url: 'https://example.com/image.jpg',
          mediaType: AttachmentMediaType.IMAGE,
        },
      ],
    });

    return await message.save();
  });

  fastify.get('/create-poll-message', async (request, reply) => {
    return await runInTransaction(async () => {
      const poll = new PollModel({
        options: ['yes', 'no'],
        voters: [
          {
            userId: '123',
            option: 'yes',
          },
        ],
        expirationDate: new Date(),
        targetType: 'all',
        actionAfterExpiration: {
          type: ActionAfterExpiration.TIMEOUT_USER,
          target: '123',
        },
      });

      const savedPoll = await poll.save();

      const message = new MessageModel({
        content: 'Do you like this poll?',
        sender: 'system',
        destination: 'system',
        type: MessageType.POLL,
        pollId: savedPoll._id,
      });
      return await message.save();
    });
  });

  fastify.get('/messages', async (_, reply) => MessageModel.find());
  fastify.get('/healthcheck', async (request, reply) => {
    return { status: 'ok', port };
  });
}

app.register(registerApiRoutes, { prefix: '/api' });

app.listen({ host: '0.0.0.0', port }, async (err) => {
  const logger = await getLogger();
  logger.info(`Server listening at ${port}`);
  if (err) {
    logger.error(err.message);
    throw err;
  }
});
