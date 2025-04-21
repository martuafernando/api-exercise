const express = require("express");
const routes = require("./routes");
const morgan = require('morgan')
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api', routes)

app.get("/", (req, res, next) => {
	res.json({
		message: "connected to server",
	});
});

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`connected to port ${PORT}`);
});
