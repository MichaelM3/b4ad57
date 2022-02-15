import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
	},
	date: {
		fontSize: 11,
		color: "#BECCE2",
		fontWeight: "bold",
		marginBottom: 5,
	},
	text: {
		fontSize: 14,
		color: "#91A3C0",
		letterSpacing: -0.2,
		padding: 8,
		fontWeight: "bold",
	},
	bubble: {
		background: "#F4F6FA",
		borderRadius: "10px 10px 0 10px",
	},
	avatar: {
		height: 24,
		width: 24,
		marginRight: 11,
		marginTop: 6,
	},
}));

const SenderBubble = (props) => {
	const classes = useStyles();
	const { time, text, otherUser, wasRead } = props;
	return (
		<Box className={classes.root}>
			<Typography className={classes.date}>{time}</Typography>
			<Box className={classes.bubble}>
				<Typography className={classes.text}>{text}</Typography>
			</Box>
			{wasRead ? (
				<Avatar
					className={classes.avatar}
					src={otherUser.photoUrl}
					alt={otherUser.username}
				></Avatar>
			) : null}
		</Box>
	);
};

export default SenderBubble;
