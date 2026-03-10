export enum IoChatEvent {
  CONNECTION = 'chat:connection',
  DISCONNECT = 'chat:disconnect',
  JOIN_ROOM = 'chat:join_room',
  LEAVE_ROOM = 'chat:leave_room',
  MESSAGE = 'chat:private_message',
  MESSAGE_DELIVERED = 'chat:message_delivered',
  MESSAGE_READ = 'chat:message_read',
  MESSAGE_DELETED = 'chat:message_deleted',
  MESSAGE_EDITED = 'chat:message_edited',
  MESSAGE_REACTION = 'chat:message_reaction',
  TYPING = 'chat:typing',
  TYPING_STOP = 'chat:typing_stop',
  USER_ONLINE = 'chat:user_online',
  USER_OFFLINE = 'chat:user_offline',

  // WebRTC signaling events
  CALL_OFFER = 'webrtc:offer',
  CALL_ANSWER = 'webrtc:answer',
  ICE_CANDIDATE = 'webrtc:ice_candidate',
  CALL_END = 'webrtc:call_end',
}
