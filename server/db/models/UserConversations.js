const Sequelize = require("sequelize");
const { User, Conversation } = require(".");
const db = require("../db");

const UserConversations = db.define("userConversations", {
	UserId: {
		type: Sequelize.INTEGER,
		references: {
			model: User,
			key: "id",
		},
	},
	ConversationId: {
		type: Sequelize.INTEGER,
		references: {
			model: Conversation,
			key: "id",
		},
	},
});

module.exports = UserConversations;
