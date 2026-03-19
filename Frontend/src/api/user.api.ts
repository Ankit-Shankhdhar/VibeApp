import API from "./axios";

export const getCurrentUser = () => {
	return API.get("/users/me");
};

export const followUser = (userId: number) => {
	return API.post(`/users/${userId}/follow`);
};

export const unfollowUser = (userId: number) => {
	return API.delete(`/users/${userId}/unfollow`);
};

export interface ChatAvailableUser {
	id: number;
	username: string;
	profilePicture: string | null;
}

export const getAvailableChatUsers = () => {
	return API.get<ChatAvailableUser[]>("/users/chat-available");
};
