const mongoose = require("../database/Mongo");

const HeaderSchema = new mongoose.Schema({
  github: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Github",
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  urls: [
    {
      url: {
				type: String,
				required: false,
			},
			description: {
				type: String,
				required: false,
			}
    },
  ],
  topLanguages: [String],
  topTags: [String],
  topUsers: {
    type: Array,
    required: false,
  },
});

const Header = mongoose.model("Header", HeaderSchema);

module.exports = Header;
