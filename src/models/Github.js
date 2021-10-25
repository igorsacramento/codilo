const mongoose = require("../database/Mongo");

const GithubSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  header: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Header'
  },
  pinned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pinned'
  }],
  repositories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repositories'
  }]
});

const Github = mongoose.model("Github", GithubSchema);

module.exports = Github;
