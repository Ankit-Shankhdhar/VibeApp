import axiosInstance from "./axios";
import { type Message, type Conversation } from "../types/chat.types";

interface StartConversationResponse {
	conversationId: number;
	otherUserId: number;
}

export const chatApi = {
	// Get all conversations for the user
	getConversations: (page = 0, size = 20) =>
		axiosInstance.get<{ content: Conversation[] }>(
			`/chat/conversations?page=${page}&size=${size}`,
		),

	// Get messages for a specific conversation
	getMessages: (conversationId: number, page = 0, size = 50) =>
		axiosInstance.get<{ content: Message[] }>(
			`/chat/conversations/${conversationId}/messages?page=${page}&size=${size}`,
		),

	// Create or get a conversation with a user
	startConversation: (userId: number) =>
		axiosInstance.post<StartConversationResponse>(
			`/chat/conversations?otherUserId=${userId}`,
		),

	// Mark messages as read
	markAsRead: (conversationId: number) =>
		axiosInstance.post(`/chat/conversations/${conversationId}/read`),
};
