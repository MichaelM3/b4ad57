import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { messagesWereRead } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
	root: {
		display: "flex",
		flexGrow: 8,
		flexDirection: "column",
	},
	chatContainer: {
		marginLeft: 41,
		marginRight: 41,
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		justifyContent: "space-between",
	},
}));

const ActiveChat = (props) => {
	const classes = useStyles();
	const { user, messagesWereRead } = props;
	const conversation = props.conversation || {};
	let lastMessage;

	if (conversation.messages) {
		messagesWereRead(conversation);
		for (let i = conversation.messages.length - 1; i >= 0; i--) {
			if (
				conversation.messages[i].isRead &&
				conversation.messages[i].senderId !== conversation.otherUser.id
			) {
				lastMessage = conversation.messages[i];
				break;
			}
		}
	}

	return (
		<Box className={classes.root}>
			{conversation.otherUser && (
				<>
					<Header
						username={conversation.otherUser.username}
						online={conversation.otherUser.online || false}
					/>
					<Box className={classes.chatContainer}>
						<Messages
							messages={conversation.messages}
							otherUser={conversation.otherUser}
							userId={user.id}
							lastMessage={lastMessage}
						/>
						<Input
							otherUser={conversation.otherUser}
							conversationId={conversation.id}
							user={user}
						/>
					</Box>
				</>
			)}
		</Box>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
		conversation:
			state.conversations &&
			state.conversations.find(
				(conversation) =>
					conversation.otherUser.username === state.activeConversation
			),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		messagesWereRead: (conversation) => {
			dispatch(messagesWereRead(conversation));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
