const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
// const UserConversations = require("./UserConversations");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });

// User.belongsToMany(Conversation, { through: UserConversations });
// Conversation.belongsToMany(User, { through: UserConversations });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
	User,
	Conversation,
	Message,
	// UserConversations,
};
