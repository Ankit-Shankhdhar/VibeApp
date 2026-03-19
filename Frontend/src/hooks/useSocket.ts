import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { type Message } from "../types/chat.types";

export const useSocket = (
	token: string | null,
	onMessageReceived: (msg: Message) => void,
) => {
	const stompClient = useRef<Client | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	// Ref for the handler prevents the effect from re-running
	// every time the parent component re-renders.
	const messageHandlerRef = useRef(onMessageReceived);

	useEffect(() => {
		messageHandlerRef.current = onMessageReceived;
	}, [onMessageReceived]);

	useEffect(() => {
		// 1. Guard: Don't connect if there is no token
		if (!token) return;

		// 2. Initialize Connection
		// Ensure this matches your Registry path in Spring Boot (e.g., .addEndpoint("/ws"))
		const socket = new SockJS("http://localhost:8080/ws");
		// const socket = new SockJS('/ws');
		const client = Stomp.over(socket);

		stompClient.current = client;
		client.debug = () => {}; // Toggle to (msg) => console.log(msg) if you need to see frames

		client.connect(
			{
				Authorization: `Bearer ${token}`,
				authorization: `Bearer ${token}`,
			},
			() => {
				setIsConnected(true);
				console.log("✅ STOMP Connected");

				// Subscribe to private messages
				// Ensure this matches your broker destination (e.g., /user/queue/messages)
				client.subscribe("/user/queue/messages", (payload) => {
					try {
						const message: Message = JSON.parse(payload.body);
						messageHandlerRef.current(message);
					} catch (error) {
						console.error("Error parsing incoming message:", error);
					}
				});
			},
			(error) => {
				// Only log error if we haven't nullified the client (avoids teardown logs)
				if (stompClient.current) {
					console.error("❌ STOMP Error:", error);
					setIsConnected(false);
				}
			},
		);

		// 3. Cleanup Function
		return () => {
			const clientToDisconnect = stompClient.current;
			stompClient.current = null; // Mark as null immediately

			if (clientToDisconnect) {
				if (clientToDisconnect.connected) {
					clientToDisconnect.disconnect(() => {
						console.log("STOMP: Disconnected safely");
					});
				} else {
					// If still in CONNECTING state, SockJS close is cleaner
					socket.close();
					console.log("STOMP: Aborted pending connection");
				}
			}
			setIsConnected(false);
		};
	}, [token]); // Only reconnect if the token changes

	const sendMessage = (conversationId: number, content: string) => {
		if (stompClient.current?.connected) {
			stompClient.current.send(
				`/app/chat/${conversationId}`,
				{},
				JSON.stringify({ content }),
			);
		} else {
			console.warn("Cannot send message: WebSocket not connected.");
		}
	};

	return { isConnected, sendMessage };
};
