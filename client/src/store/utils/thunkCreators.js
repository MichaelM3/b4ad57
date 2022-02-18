import axios from "axios";
import socket from "../../socket";
import {
	gotConversations,
	addConversation,
	setNewMessage,
	setSearchedUsers,
	messagesRead,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
	const token = await localStorage.getItem("messenger-token");
	config.headers["x-access-token"] = token;

	return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
	dispatch(setFetchingStatus(true));
	try {
		const { data } = await axios.get("/auth/user");
		dispatch(gotUser(data));
		if (data.id) {
			socket.emit("go-online", data.id);
		}
	} catch (error) {
		console.error(error);
	} finally {
		dispatch(setFetchingStatus(false));
	}
};

export const register = (credentials) => async (dispatch) => {
	try {
		const { data } = await axios.post("/auth/register", credentials);
		await localStorage.setItem("messenger-token", data.token);
		dispatch(gotUser(data));
		socket.emit("go-online", data.id);
	} catch (error) {
		console.error(error);
		dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
	}
};

export const login = (credentials) => async (dispatch) => {
	try {
		const { data } = await axios.post("/auth/login", credentials);
		await localStorage.setItem("messenger-token", data.token);
		dispatch(gotUser(data));
		socket.emit("go-online", data.id);
	} catch (error) {
		console.error(error);
		dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
	}
};

export const logout = (id) => async (dispatch) => {
	try {
		await axios.delete("/auth/logout");
		await localStorage.removeItem("messenger-token");
		dispatch(gotUser({}));
		socket.emit("logout", id);
	} catch (error) {
		console.error(error);
	}
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
	try {
		const { data } = await axios.get("/api/conversations");
		data.map((convo) => convo.messages.reverse());
		dispatch(gotConversations(data));
	} catch (error) {
		console.error(error);
	}
};

const saveMessage = async (body) => {
	const { data } = await axios.post("/api/messages", body);
	return data;
};

export const saveMessageRead = async (conversation) => {
	const { data } = await axios.put(
		`api/conversations/${conversation.id}`,
		conversation
	);
	return data;
};

export const unreadMessageCount = async (conversationId) => {
	const { data } = await axios.get(`/api/conversations/${conversationId}`);
	return data;
};

export const sendUpdatedMessage = (conversation, messages) => {
	socket.emit("message-read", {
		messages: messages,
		conversation: conversation,
	});
};

const sendMessage = (data, body) => {
	socket.emit("new-message", {
		message: data.message,
		recipientId: body.recipientId,
		sender: data.sender,
		conversationId: data.message.conversationId,
	});
};

export const messagesWereRead = (conversation) => async (dispatch) => {
	try {
		const unreadMessagesArray = [];
		for (let i = conversation.messages.length - 1; i >= 0; i--) {
			if (
				conversation.messages[i].isRead === false &&
				conversation.messages[i].senderId === conversation.otherUser.id
			) {
				unreadMessagesArray.push(conversation.messages[i]);
			} else if (
				conversation.messages[i].senderId === conversation.otherUser.id
			) {
				break;
			}
		}
		if (unreadMessagesArray.length > 0) {
			await saveMessageRead(conversation);
			dispatch(messagesRead(conversation, unreadMessagesArray));
			sendUpdatedMessage(conversation, unreadMessagesArray);
		}
	} catch (error) {
		console.error(error);
	}
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
// data needs to be asynchronous otherwise payload is undefined
export const postMessage = (body) => async (dispatch) => {
	try {
		const data = await saveMessage(body);

		if (!body.conversationId) {
			dispatch(addConversation(body.recipientId, data.message));
		} else {
			dispatch(setNewMessage(data.message, data.sender));
		}

		sendMessage(data, body);
	} catch (error) {
		console.error(error);
	}
};

export const searchUsers = (searchTerm) => async (dispatch) => {
	try {
		const { data } = await axios.get(`/api/users/${searchTerm}`);
		dispatch(setSearchedUsers(data));
	} catch (error) {
		console.error(error);
	}
};
