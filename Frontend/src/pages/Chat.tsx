import React, { useState, useEffect, useRef } from "react";
import {
	MoreHorizontal,
	Send,
	Smile,
	Image,
	Mic,
	Zap,
	ChevronLeft,
	Users,
	Radio,
	Disc,
	Compass,
} from "lucide-react";
import { chatApi } from "../api/chat.api";
import { getAvailableChatUsers, type ChatAvailableUser } from "../api/user.api";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";

// --- Types ---
interface User {
	id: string;
	name: string;
	username: string;
	avatar: string;
	aura: "cosmic" | "neon" | "earth" | "pastel";
	vibe: number;
	online?: boolean;
	lastSeen?: string;
}

interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: Date;
	vibeCount: number;
	vibedByMe: boolean;
}

interface Conversation {
	id: string;
	participant: User;
	lastMessage: string;
	lastMessageTime: Date;
	unreadCount: number;
	messages: Message[];
}

// THE ULTIMATE TIMESTAMP FIX
const parseSafeDate = (dateInput: any): Date => {
	if (!dateInput) return new Date();
	try {
		const rawLocalString = String(dateInput).substring(0, 19);
		return new Date(rawLocalString);
	} catch (error) {
		return new Date();
	}
};

const formatMessageTime = (date: Date) => {
	if (!(date instanceof Date) || isNaN(date.getTime())) return "";
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatConversationTime = (date: Date) => {
	if (!(date instanceof Date) || isNaN(date.getTime())) return "";
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMs < 0 || diffMins < 1) return "now";
	if (diffMins < 60) return `${diffMins}m`;
	if (diffHours < 24) return `${diffHours}h`;
	return `${diffDays}d`;
};

const ChatScreen: React.FC = () => {
	const { user: authUser, token } = useAuth();
	const [timeOfDay] = useState<"day" | "night">("day");
	const [selectedConversation, setSelectedConversation] = useState<
		string | null
	>(null);

	const [messageInput, setMessageInput] = useState("");
	const [isMobile, setIsMobile] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [availableUsers, setAvailableUsers] = useState<ChatAvailableUser[]>([]);

	const mapConversation = (c: any): Conversation => ({
		id: c.conversationId.toString(),
		participant: {
			id: c.otherUserId.toString(),
			name: c.otherUsername,
			username: `@${c.otherUsername.toLowerCase()}`,
			avatar:
				c.otherProfilePicture ||
				`https://ui-avatars.com/api/?name=${c.otherUsername}`,
			aura: c.otherAura || "cosmic",
			vibe: 90,
			online: true,
		},
		lastMessage: c.lastMessageContent || "No messages yet",
		lastMessageTime: c.lastMessageSentAt
			? parseSafeDate(c.lastMessageSentAt)
			: new Date(),
		unreadCount: c.unreadCount,
		messages: [],
	});

	const loadConversations = async () => {
		try {
			const res = await chatApi.getConversations();
			const mapped = res.data.content.map(mapConversation);
			setConversations(mapped);
		} catch (error) {
			console.error("Failed to load conversations", error);
		}
	};

	// 1. Fetch all conversations
	useEffect(() => {
		loadConversations();
	}, []);

	useEffect(() => {
		const loadAvailableUsers = async () => {
			try {
				const res = await getAvailableChatUsers();
				setAvailableUsers(res.data);
			} catch (error) {
				console.error("Failed to load users for chat", error);
			}
		};

		loadAvailableUsers();
	}, []);

	// 2. Fetch messages
	useEffect(() => {
		if (!selectedConversation) return;
		const loadMessages = async () => {
			try {
				const res = await chatApi.getMessages(parseInt(selectedConversation));
				const mappedMsgs: Message[] = res.data.content
					.reverse()
					.map((m: any) => ({
						id: m.id.toString(),
						senderId:
							m.senderId.toString() === authUser?.id?.toString()
								? "me"
								: m.senderId.toString(),
						text: m.content,
						timestamp: parseSafeDate(m.sentAt),
						vibeCount: 0,
						vibedByMe: false,
					}));
				setConversations((prev) =>
					prev.map((c) =>
						c.id === selectedConversation ? { ...c, messages: mappedMsgs } : c,
					),
				);
			} catch (error) {
				console.error("Failed to load messages", error);
			}
		};
		loadMessages();
	}, [selectedConversation, authUser?.id]);

	// --- THE ULTIMATE LIVE CHAT FIX ---
	// We use a mutable Ref to hold our receiving logic. This perfectly bypasses the
	// custom `useSocket` hook and ensures React ALWAYS knows exactly which chat is open.
	const handleIncomingMessage = useRef<(msg: any) => void>(() => {});

	// This updates every single time the component re-renders
	handleIncomingMessage.current = (newMsg: any) => {
		if (!newMsg) return;

		// Ignore your own echoed messages
		if (newMsg.senderId?.toString() === authUser?.id?.toString()) return;

		// This is guaranteed to be 100% accurate now
		const isForActiveChat =
			selectedConversation === newMsg.conversationId?.toString();

		const correctLocalTime = parseSafeDate(newMsg.sentAt);

		const uiMsg: Message = {
			id: newMsg.id?.toString() || `live-${Date.now()}`,
			senderId: "participant",
			text: newMsg.content,
			timestamp: correctLocalTime,
			vibeCount: 0,
			vibedByMe: false,
		};

		setConversations((prev) =>
			prev.map((conv) => {
				if (conv.id !== newMsg.conversationId?.toString()) return conv;
				return {
					...conv,
					// Pushes the message instantly!
					messages: isForActiveChat
						? [...(conv.messages || []), uiMsg]
						: conv.messages || [],
					lastMessage: newMsg.content,
					lastMessageTime: correctLocalTime,
					unreadCount: isForActiveChat ? 0 : (conv.unreadCount || 0) + 1,
				};
			}),
		);
	};

	// We pass a stable wrapper function to useSocket. It never changes, so the hook is happy,
	// but it always executes the freshest logic from the Ref!
	const { isConnected, sendMessage } = useSocket(token, (msg: any) => {
		console.log("Received WebSocket message:", msg);
		handleIncomingMessage.current(msg);
	});
	// ----------------------------------

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageInput.trim() || !selectedConversation || !isConnected) return;

		const textToSend = messageInput.trim();
		setMessageInput("");

		// Create a temporary message for instant UI display
		const instantMsg: Message = {
			id: `temp-${Date.now()}`,
			senderId: "me",
			text: textToSend,
			timestamp: new Date(),
			vibeCount: 0,
			vibedByMe: false,
		};

		// Push directly to UI
		setConversations((prev) =>
			prev.map((conv) => {
				if (conv.id !== selectedConversation) return conv;
				return {
					...conv,
					messages: [...(conv.messages || []), instantMsg],
					lastMessage: textToSend,
					lastMessageTime: instantMsg.timestamp,
				};
			}),
		);

		// Send silently in the background
		sendMessage(parseInt(selectedConversation), textToSend);
	};

	const handleVibeMessage = (conversationId: string, messageId: string) => {
		setConversations((prev) =>
			prev.map((conv) => {
				if (conv.id !== conversationId) return conv;
				return {
					...conv,
					messages: conv.messages.map((msg) =>
						msg.id === messageId
							? {
									...msg,
									vibeCount: msg.vibedByMe
										? msg.vibeCount - 1
										: msg.vibeCount + 1,
									vibedByMe: !msg.vibedByMe,
								}
							: msg,
					),
				};
			}),
		);
	};

	const handleStartConversation = async (user: ChatAvailableUser) => {
		try {
			const existing = conversations.find(
				(conv) => conv.participant.id === user.id.toString(),
			);
			if (existing) {
				setSelectedConversation(existing.id);
				return;
			}

			const response = await chatApi.startConversation(user.id);
			await loadConversations();
			setSelectedConversation(response.data.conversationId.toString());
		} catch (error) {
			console.error("Failed to start conversation", error);
		}
	};

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [selectedConversation, conversations]);

	const activeConversation = conversations.find(
		(c) => c.id === selectedConversation,
	);

	const getAuraColors = (aura: string) => {
		switch (aura) {
			case "cosmic":
				return { bg: "bg-[#E8F5BD]", text: "text-[#2C4A2B]" };
			case "neon":
				return { bg: "bg-[#A2CB8B]", text: "text-[#1A2F1A]" };
			case "earth":
				return { bg: "bg-[#84B179]", text: "text-[#1A2F1A]" };
			case "pastel":
				return { bg: "bg-[#E8F5BD]", text: "text-[#2C4A2B]" };
			default:
				return { bg: "bg-[#E8F5BD]", text: "text-[#2C4A2B]" };
		}
	};

	const getCardStyles = (isLight: boolean) => ({
		bg: isLight ? "bg-[#E8F5BD]" : "bg-[#2C4A2B]",
		text: isLight ? "text-[#1A2F1A]" : "text-[#E8F5BD]",
		textMuted: isLight ? "text-[#84B179]" : "text-[#A2CB8B]",
		border: "border-[#84B179]",
		inputBg: isLight ? "bg-[#A2CB8B]" : "bg-[#1A2F1A]",
		placeholder: isLight
			? "placeholder:text-[#2C4A2B]"
			: "placeholder:text-[#A2CB8B]",
	});

	const styles = getCardStyles(timeOfDay === "day");

	return (
		<div
			className={`h-screen flex flex-col transition-colors duration-1000 ${
				timeOfDay === "night" ? "bg-[#1A2F1A]" : "bg-[#E8F5BD]"
			}`}
		>
			<div className="flex-1 overflow-hidden flex">
				{(!isMobile || (isMobile && !selectedConversation)) && (
					<div
						className={`${
							isMobile ? "w-full" : "w-80"
						} h-full overflow-y-auto border-r border-[#84B179]`}
					>
						<div className="p-4 space-y-3">
							<div
								className={`border ${styles.border} ${styles.bg} rounded-2xl p-3`}
							>
								<p
									className={`text-xs uppercase tracking-wide ${styles.textMuted}`}
								>
									Message users
								</p>
								<div className="mt-2 space-y-2">
									{availableUsers.length === 0 && (
										<p className={`text-sm ${styles.textMuted}`}>
											No users available
										</p>
									)}
									{availableUsers.map((user) => (
										<button
											key={user.id}
											onClick={() => handleStartConversation(user)}
											className={`w-full text-left p-2 rounded-xl border ${styles.border} hover:bg-[#84B179]/20 transition`}
										>
											<div className="flex items-center gap-2">
												<img
													src={
														user.profilePicture ||
														`https://ui-avatars.com/api/?name=${user.username}`
													}
													alt={user.username}
													className="w-8 h-8 rounded-lg object-cover"
												/>
												<span className={`text-sm font-medium ${styles.text}`}>
													{user.username}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>

							{conversations.map((conv) => {
								const isSelected = selectedConversation === conv.id;
								return (
									<button
										key={conv.id}
										onClick={() => {
											setSelectedConversation(conv.id);
										}}
										className={`w-full text-left p-3 rounded-2xl border transition-all ${
											isSelected
												? `bg-[#84B179] border-[#84B179]`
												: `border-[#84B179] ${styles.bg} hover:bg-[#84B179]/20`
										}`}
									>
										<div className="flex items-center gap-3">
											<div className="relative">
												<img
													src={conv.participant.avatar}
													alt={conv.participant.name}
													className="w-12 h-12 rounded-xl object-cover"
												/>
												{conv.participant.online && (
													<span className="absolute bottom-0 right-0 w-3 h-3 bg-[#84B179] rounded-full ring-2 ring-white" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<span
														className={`font-semibold truncate ${
															isSelected ? "text-[#1A2F1A]" : styles.text
														}`}
													>
														{conv.participant.name}
													</span>
													<span
														className={`text-xs ${
															isSelected ? "text-[#1A2F1A]" : styles.textMuted
														}`}
													>
														{formatConversationTime(conv.lastMessageTime)}
													</span>
												</div>
												<div className="flex items-center justify-between mt-1">
													<span
														className={`text-sm truncate max-w-37.5 ${
															isSelected ? "text-[#1A2F1A]" : styles.textMuted
														}`}
													>
														{conv.lastMessage}
													</span>
													{conv.unreadCount > 0 && (
														<span
															className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
																isSelected
																	? "bg-[#1A2F1A] text-[#E8F5BD]"
																	: "bg-[#84B179] text-[#1A2F1A]"
															}`}
														>
															{conv.unreadCount}
														</span>
													)}
												</div>
											</div>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				)}

				{selectedConversation && activeConversation ? (
					<div className="flex-1 h-full flex flex-col">
						<div
							className={`flex items-center gap-3 p-4 border-b border-[#84B179] ${
								timeOfDay === "night" ? "bg-[#2C4A2B]" : "bg-[#E8F5BD]"
							}`}
						>
							{isMobile && (
								<button
									onClick={() => {
										setSelectedConversation(null);
									}}
									className={`p-2 mr-1 rounded-xl transition-colors hover:bg-[#84B179]/20 ${styles.text}`}
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
							)}
							<img
								src={activeConversation.participant.avatar}
								alt={activeConversation.participant.name}
								className="w-10 h-10 rounded-xl object-cover"
							/>
							<div className="flex-1">
								<div className={`font-semibold ${styles.text}`}>
									{activeConversation.participant.name}
								</div>
								<div className={`text-xs ${styles.textMuted}`}>
									{activeConversation.participant.online
										? "Online"
										: `Last seen ${activeConversation.participant.lastSeen}`}
								</div>
							</div>
							<button
								className={`p-2 rounded-lg border ${styles.border} ${styles.text}`}
							>
								<MoreHorizontal className="h-5 w-5" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{activeConversation.messages.map((msg) => {
								const isMe = msg.senderId === "me";
								const sender = isMe
									? {
											...authUser,
											id: "me",
											name: authUser?.username || "Me",
											avatar:
												authUser?.profileImage ||
												`https://ui-avatars.com/api/?name=${authUser?.username}`,
											aura: "cosmic" as const,
											vibe: 100,
										}
									: activeConversation.participant;
								const aura = getAuraColors(
									isMe ? "cosmic" : activeConversation.participant.aura,
								);

								return (
									<div
										key={msg.id}
										className={`flex ${isMe ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[70%] ${isMe ? "order-2" : "order-1"}`}
										>
											<div
												className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
											>
												{!isMe && (
													<img
														src={sender.avatar as string}
														alt={sender.username}
														className="w-8 h-8 rounded-lg object-cover"
													/>
												)}
												<div>
													<div
														className={`relative group rounded-2xl px-4 py-2 ${
															isMe
																? timeOfDay === "night"
																	? "bg-[#84B179] text-[#1A2F1A]"
																	: "bg-[#2C4A2B] text-[#E8F5BD]"
																: `border ${styles.border} ${styles.bg}`
														}`}
													>
														<p className="text-sm">{msg.text}</p>
														<div className="flex items-center justify-end gap-2 mt-1">
															<span
																className={`text-xs ${
																	isMe
																		? timeOfDay === "night"
																			? "text-[#1A2F1A]"
																			: "text-[#A2CB8B]"
																		: styles.textMuted
																}`}
															>
																{formatMessageTime(msg.timestamp)}
															</span>
															<button
																onClick={() =>
																	handleVibeMessage(
																		activeConversation.id,
																		msg.id,
																	)
																}
																className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-all ${
																	msg.vibedByMe
																		? `${aura.bg} text-[#1A2F1A]`
																		: "hover:bg-[#84B179]/20"
																}`}
															>
																<Zap
																	className={`h-3 w-3 ${
																		msg.vibedByMe ? "fill-[#1A2F1A]" : ""
																	}`}
																/>
																<span className="text-xs">{msg.vibeCount}</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
							<div ref={messagesEndRef} />
						</div>

						<div className={`p-4 border-t border-[#84B179] ${styles.bg}`}>
							<form
								onSubmit={handleSendMessage}
								className="flex items-center gap-2"
							>
								<button
									type="button"
									className={`p-2 rounded-lg border ${styles.border} ${styles.text}`}
								>
									<Smile className="h-5 w-5" />
								</button>
								<button
									type="button"
									className={`p-2 rounded-lg border ${styles.border} ${styles.text}`}
								>
									<Image className="h-5 w-5" />
								</button>
								<button
									type="button"
									className={`p-2 rounded-lg border ${styles.border} ${styles.text}`}
								>
									<Mic className="h-5 w-5" />
								</button>
								<input
									type="text"
									placeholder="Type your frequency..."
									value={messageInput}
									onChange={(e) => setMessageInput(e.target.value)}
									className={`flex-1 px-4 py-2 rounded-xl border ${styles.border} ${styles.inputBg} ${styles.text} ${styles.placeholder} focus:outline-none focus:ring-2 focus:ring-[#84B179]`}
								/>
								<button
									type="submit"
									disabled={!messageInput.trim() || !isConnected}
									className={`p-2 rounded-lg bg-[#84B179] text-[#1A2F1A] hover:bg-[#A2CB8B] transition disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									<Send className="h-5 w-5" />
								</button>
							</form>
						</div>
					</div>
				) : (
					<div className="hidden md:flex flex-1 items-center justify-center">
						<div className="text-center space-y-4">
							<div className={`text-6xl`}>💬</div>
							<p className={`text-xl ${styles.text}`}>Select a conversation</p>
							<p className={`text-sm ${styles.textMuted}`}>
								or start a new vibe with someone
							</p>
						</div>
					</div>
				)}
			</div>

			{isMobile && !selectedConversation && (
				<div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#84B179] bg-[#2C4A2B]">
					<div className="flex items-center justify-around py-2">
						{[
							{ icon: Compass, label: "Explore", active: true },
							{ icon: Radio, label: "Live", active: false },
							{ icon: Disc, label: "Sounds", active: false },
							{ icon: Users, label: "Circle", active: false },
						].map((item) => (
							<button
								key={item.label}
								className={`p-2 rounded-xl transition-all ${
									item.active
										? "bg-[#84B179] text-[#1A2F1A]"
										: "text-[#E8F5BD] hover:text-[#A2CB8B]"
								}`}
							>
								<item.icon className="h-5 w-5" />
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatScreen;
