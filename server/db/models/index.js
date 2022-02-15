const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UsesrConversations = require("./UserConversations");

// associations

// User.hasMany(Conversation);
// Conversation.belongsTo(User, { as: "user1" });
// Conversation.belongsTo(User, { as: "user2" });
// Conversation.belongsTo(User)

// Created a join table for the user and conversations belongsToMany relationship
User.belongsToMany(Conversation, { through: UsesrConversations });
Conversation.belongsToMany(User, { through: UsesrConversations });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
	User,
	Conversation,
	Message,
	UsesrConversations,
};
