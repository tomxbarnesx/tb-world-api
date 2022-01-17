const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const portfolioLinkSchema = new Schema({
	title: { 
		type: String, 
		required: true
	},
    url: {
        type: String,
        required: true,
    }
}, {
	timestamps: true,
});

const PortfolioLink = mongoose.model('PortfolioLink', portfolioLinkSchema);

module.exports = PortfolioLink;