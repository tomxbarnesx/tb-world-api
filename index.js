const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require('compression');

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT);

mongoose.connect(
	process.env.MONGO_URI,{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},(err) => {
		if (err) throw err;
	}
);

app.use("/users", require("./routes/users"));
app.use("/media-tiles", require("./routes/mediaTiles"));
app.use("/poems", require("./routes/poems"));
app.use("/portfolio-links", require("./routes/portfolioLinks"));
