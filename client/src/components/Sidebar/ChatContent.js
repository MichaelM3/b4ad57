import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		justifyContent: "space-between",
		marginLeft: 20,
		flexGrow: 1,
	},
	username: {
		fontWeight: "bold",
		letterSpacing: -0.2,
	},
	previewText: {
		fontSize: 12,
		color: "#9CADC8",
		letterSpacing: -0.17,
	},
	unreadCount: {
		fontSize: 10,
		fontWeight: "bolder",
		color: "#FFFFFF",
		background: "#3F92FF",
		borderRadius: 10,
		paddingLeft: 5,
		paddingRight: 5,
		height: 15,
	},
}));

const ChatContent = (props) => {
	const classes = useStyles();

	const { conversation } = props;
	const { latestMessageText, otherUser, messages } = conversation;

	const unreadMessageCount = messages.filter((message) => {
		return (
			message.senderId === otherUser.id && message.messageRead === false
		);
	}).length;

	return (
		<Box className={classes.root}>
			<Box>
				<Typography className={classes.username}>
					{otherUser.username}
				</Typography>
				<Typography className={classes.previewText}>
					{latestMessageText}
				</Typography>
			</Box>
			{unreadMessageCount > 0 ? (
				<Typography className={classes.unreadCount}>
					{unreadMessageCount}
				</Typography>
			) : null}
		</Box>
	);
};

export default ChatContent;
