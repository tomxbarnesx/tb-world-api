const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
 
mongoose.plugin(slug);

const poemSchema = new Schema({
	title: { 
		type: String, 
		required: true
	},
    slug: { 
    	type: String, 
    	slug: "title" 
    },
    content: { 
    	type: String, 
    	required: true
    },

}, {
	timestamps: true,
});

const Poem = mongoose.model('Poem', poemSchema);

module.exports = Poem;