const mongoose = require("../database/Mongo");

const RepositoriesSchema = new mongoose.Schema({
	github: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Github',
		required: false,
	},
  repository: {
    type: String,
    required: false,
  },
  status: {
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
  tags: [String],
  description: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  forks: {
    type: String,
    required: false,
  },
  stars: {
    type: String,
    required: false,
  },
  issues: {
    type: String,
    required: false,
  },
  pullRequests: {
    type: String,
    required: false,
  },
  lastUpdate: {
    type: String,
    required: false,
  },
});

const Repositories = mongoose.model(
  "Repositories",
  RepositoriesSchema
);

module.exports = Repositories;
