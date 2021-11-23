const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaTileSchema = new Schema({
	title: { type: String, required: true},
	mediaLocation: { type: String, required: true,},
	mediaName: { type: String, required: true, },
	date: { type: Date, required: true}
}, {
	timestamps: true,
});

const VideoTile = mongoose.model('MediaTile', mediaTileSchema);

module.exports = VideoTile;