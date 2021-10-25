const mongoose = require("../database/Mongo");

const PinnedSchema = new mongoose.Schema({
	github: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Github',
		required: false,
	},
  repository: {
    type: String,
    required: false,
  },
	url: {
    type: String,
    required: false,
  },
	description: {
    type: String,
    required: false,
  },
	language: {
    type: String,
    required: false,
  },
	stars: {
    type: String,
    required: false,
  },
	forks: {
    type: String,
    required: false,
  },
});

const Pinned = mongoose.model(
  "Pinned",
  PinnedSchema
);

module.exports = Pinned;
