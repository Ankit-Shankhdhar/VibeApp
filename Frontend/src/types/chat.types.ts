import { type User } from './auth.types'; // Assuming User is in auth.types

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  senderUsername: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface Conversation {
  conversationId: number;
  otherUserId: number;
  otherUsername: string;
  otherProfilePicture: string | null;
  lastMessageContent: string;
  lastMessageSentAt: string;
  unreadCount: number;
}