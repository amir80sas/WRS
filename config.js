
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	"TOKEN": process.env.TOKEN,
	"YOUTUBE_API_KEY": process.env.YOUTUBE_API_KEY,
	"MAX_PLAYLIST_SIZE": 10,
	"PREFIX": process.env.p,
	"MUSIC_CHANNEL_ID": 656473202335416359,
};
